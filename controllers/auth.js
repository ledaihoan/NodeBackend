const jwtHelper = require("../helpers/jwt");
import User from '../models/user';
// const debug = console.log.bind(console);
import Token from '../models/token';
import Forgot from '../models/forgot';
import mailer from '../helpers/mail';
// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || ")O,Y~80_Y,q7nGIW@A56LEtI_E=Q)+0v#5;/o!$sUu/bow$m`h5HCb;<MW]Dy;/H";
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "4h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "kRt!{ I+Sa^EvzN4-JGPGEG YL3g]`2w.NT/:+PM]@&e?s|/9FQF{Y]/);0$-x)A";

const forgotTokenSecret = process.env.FORGOT_TOKEN_SECRET || "mH9hyvwwyPZ5zwXC1Rp85aJjzwAQWg9vs34WzRujtA1HxJsK8mSR8TL60wUtCfdau+Jhbeh0UyMZmYDe";
const forgotTokenLife = process.env.FORGOT_TOKEN_LIFE || "24h";
const pwdResetUrl = process.env.RESET_PWD_URL || 'https://backend.ledaihoan.com/api/reset';
/**
 * controller login
 * @param {*} req
 * @param {*} res
 */
let login = async (req, res) => {
    let token;
    try {
        console.log(`Đang login với Email: ${req.body.email} và Password: ${req.body.password}`);
        // - Đầu tiên Kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa?
        let user = await User.findByEmail(req.body.email);
        console.log(`user = ${JSON.stringify(user)}`);
        if(user != null) {
            let isMatch = await user.verifyPassword(req.body.password);
            console.log(`kiểm tra pass = ${isMatch}`);
            if(isMatch) {
                const userData = {
                    _id: user._id,
                    fullname: user.fullname
                };
                console.log(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
                const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
                console.log(`Thực hiện tạo mã Refresh Token, [thời gian sống 4 giờ]`);
                const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);
                token = new Token({access: accessToken, refresh: refreshToken, userid: user._id});
                res.cookie('access_token', accessToken, {
                    maxAge: 7 * 60 * 60 * 1000, // thời gian sống
                    httpOnly: true, // chỉ có http mới đọc được token
                    secure: process.env.SSL || false //ssl nếu có, nếu chạy localhost thì comment nó lại
                });
                res.cookie('refresh_token', refreshToken, {
                    maxAge: 7 * 60 * 60 * 1000, // thời gian sống
                    httpOnly: true, // chỉ có http mới đọc được token
                    secure: process.env.SSL || false //ssl nếu có, nếu chạy localhost thì comment nó lại
                });
                console.log(`Gửi Token và Refresh Token về cho client...`);
                const success = true;
                return res.status(200).json({success, accessToken, refreshToken});
            }
        } else {
            console.log('sai thông tin đăng nhập');
            return res.status(400).json({message: "Thông tin đăng nhập không đúng"});
        }
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({message: `Lỗi hệ thống.. ${error.message}`});
    } finally {
        if(token != null) {
            await token.save();
        }
    }
};
/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
let refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.cookies.refresh_token || req.body.refreshToken;
    // debug("tokenList: ", tokenList);
    let token;
    try {
        if (refreshTokenFromClient) {
            token = await Token.find({refresh: refreshTokenFromClient}).exec();
        }

    } catch(e) {
        console.log(e);
    }
    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && token) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
            // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
            // debug("decoded: ", decoded);
            const userData = decoded.data;
            console.log(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
            const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
            token.access = accessToken;
            res.cookie('access_token', accessToken, {
                maxAge: 7 * 60 * 60 * 1000, // thời gian sống
                httpOnly: true, // chỉ có http mới đọc được token
                secure: process.env.SSL || false //ssl nếu có, nếu chạy localhost thì comment nó lại
            });
            // gửi token mới về cho người dùng
            return res.status(200).json({success: true, token: accessToken, user: userData});
        } catch (error) {
            // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
            console.log(error);
            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        } finally {
            await token.save();
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
};
let forgot = async(req, res) => {
    if(req.body.email) {
        let forgotEmail, forgotToken;
        try {
            let user = await User.findByEmail(req.body.email);
            if(user) {
                const userData = {
                    id: user._id
                };
                forgotToken = await jwtHelper.generateToken(userData, forgotTokenSecret, forgotTokenLife);
                res.cookie('forgot_token', forgotToken, {
                    maxAge: 7 * 60 * 60 * 1000, // thời gian sống
                    httpOnly: true, // chỉ có http mới đọc được token
                    secure: process.env.SSL || false//ssl nếu có, nếu chạy localhost thì comment nó lại
                });
                const forgot = new Forgot({access: forgotToken});
                forgotEmail = await forgot.save();
                return await res.json({success: true, message: 'An email has been sent. Please check your inbox for instruction'});
            } else {
                return await res.status(403).json({success: false, message: 'There is no account associate with your email'});
            }

        } catch (e) {
            return await res.status(503).json({success: false, message: 'Request Error'});
        } finally {
            if(forgotEmail) {
                await mailer.sendForgotMail([req.body.email], pwdResetUrl);
            }
        }

    } else {
        return await res.status(403).json({success: false, message: 'Invalid request'});
    }
};
let changePassword = async(req, res) => {
    const tokenFromClient = req.cookies.access_token || req.body.token || req.query.token || req.headers["x-access-token"];
    let tokenDb, user, forgotToken;
    try {
        tokenDb = await Token.find({access: tokenFromClient}).exec();
    } catch(e) {
        console.log(e.stack);
        return await res.json({success: false, message: 'Error while processing request. Please try login again'});
    }
    if(tokenFromClient && tokenDb) {
        try {
            const userData = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            const requestUser = await User.find({_id: userData._id}).exec();
            requestUser.password = req.body.password;
            user = await requestUser.save();
        } catch(e) {
            return await res.json({success: false, message: 'Error while processing request. Please try login again'});
        }
    } else {
        forgotToken = req.cookies.forgot_token || req.params.token;
        let forgot;
        if(forgotToken) {
            try {
                forgot = await Forgot.find({access: forgotToken}).exec();
                if(forgot) {
                    const userData = await jwtHelper.verifyToken(forgotToken, forgotTokenSecret);
                    const requestUser = await User.find({_id: userData._id}).exec();
                    requestUser.password = req.body.password;
                    user = await requestUser.save();
                }
            } catch(err) {
                return await res.json({success: false, message: 'Error while processing your password change request'});
            }

        }
    }
    const rs = user ? {success: true, message: 'Your password was successfully changed'} : {success: false, message: 'Your session was invalid, please try login again'};
    return res.json(rs);

};
const obj = {
    login: login,
    refreshToken: refreshToken,
    forgot: forgot,
    changePassword: changePassword
};
module.exports = obj;
export default obj;