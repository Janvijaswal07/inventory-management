const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user-controllers");

router.route("/register").post(userControllers.registerUser);
router.route("/login").post(userControllers.loginUser);

module.exports = router;
