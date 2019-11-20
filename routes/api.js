// import express from "express";
// const router = express.Router();
// import AuthMiddleWare from "../middleware/auth";
import AuthController from "../controllers/auth";
// import UserController from "../controllers/user";
// const FriendController = require("../controllers/FriendController");
/**
 * Init all APIs on your application
 * @param {*} app from express
 */
function initAPIs(app) {
    app.post("/api/login", AuthController.login);
    app.post("/api/refresh-token", AuthController.refreshToken);
    app.post("/api/forgot", AuthController.forgot);
    app.post("/api/changePassword", AuthController.changePassword);
    // Sử dụng authMiddleware.isAuth trước những api cần xác thực
    // router.use(AuthMiddleWare.isAuth);
    // // List Protect APIs:
    // router.get("/users/get", UserController.getUsers);
}
export default initAPIs;