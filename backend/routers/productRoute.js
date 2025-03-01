const express = require("express");
const router = express.Router();
 const protect = require("../middleware/authMiddleware");
const productControllers = require("../controllers/productController");
router.route("/createProduct").post(protect,productControllers.createProduct);

module.exports= router;