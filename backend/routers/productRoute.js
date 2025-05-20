const express = require("express");
const router = express.Router();
 const protect = require("../middleware/authMiddleware");
const productControllers = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");

router.route("/createProduct").post(protect,upload.single("image"),productControllers.createProduct);
router.route("/updateProduct/:id").put(protect,upload.single("image"),productControllers.updateProduct);
router.route("/getProducts").get(protect,productControllers.getProducts);
router.route("/getSingleProduct/:id").get(protect,productControllers.getSingleProduct);
router.route("/deleteProduct/:id").delete(protect,productControllers.deleteProduct);

module.exports= router;