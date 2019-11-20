const jwtHelper = require("../helpers/jwt");
const debug = console.log.bind(console);
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || ")O,Y~80_Y,q7nGIW@A56LEtI_E=Q)+0v#5;/o!$sUu/bow$m`h5HCb;<MW]Dy;/H";
import Token from '../models/token';
/**
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let isAuth = async (req, res, next) => {
    // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
    console.log(req.cookies.access_token + '| ' + req.headers["x-access-token"]);
    const tokenFromClient = req.cookies.access_token || req.body.token || req.query.token || req.headers["x-access-token"];
    let tokenDb;
    try {
        tokenDb = await Token.find({access: tokenFromClient}).exec();
    } catch(e) {
        console.log(e.stack);
        return await res.json({success: false, message: 'Error while processing request. Please try login again'});
    }
    if (tokenFromClient && tokenDb) {
        // Nếu tồn tại token
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
            req.jwtDecoded = decoded;
            req.user = decoded.data;
            // Cho phép req đi tiếp sang controller.
            next();
        } catch (error) {
            // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
            // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
            debug("Error while verify token:", error);
            return res.status(401).json({
                success: false,
                message: 'Unauthorized.'
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};
const obj = {
    isAuth: isAuth
};
export default obj;