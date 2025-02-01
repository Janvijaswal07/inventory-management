const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user-controllers");
const protect = require("../middleware/authMiddleware");

router.route("/register").post(userControllers.registerUser);
router.route("/login").post(userControllers.loginUser);
router.route("/logout").get(userControllers.logout);
router.route("/getUser").get(protect, userControllers.getUser);
router.route("/loggedin").get(userControllers.loginStatus);
router.route("/updateuser").patch(protect, userControllers.updateUser);
router.route("/changepassword").patch(protect, userControllers.changePassword);
router.route("/forgotpassword").post(userControllers.forgotPassword);

module.exports = router;
