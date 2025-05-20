const path = require("path");
const fs = require("fs"); // Add this line to use file system
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("../config/cloudinary");

// Create the product
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  if (req.file) {
    try {
      // console.log("Normalizing path for Cloudinary upload...");
      const normalizedPath = path.normalize(req.file.path).replace(/\\/g, "/");
      // console.log("Normalized file path for Cloudinary:", normalizedPath);

      // Upload to Cloudinary
      const uploadedFile = await cloudinary.uploader.upload(normalizedPath, {
        folder: "Pinvent App",
        resource_type: "image",
      });

      // console.log("Uploaded to Cloudinary:", uploadedFile);

      // Delete local file after successful upload
      // fs.unlink(normalizedPath, (err) => {
      //   if (err) {
      //     console.error("Error deleting local file:", err);
      //   } else {
      //     console.log("Local file deleted successfully:", normalizedPath);
      //   }
      // });

      // Prepare file data
      const fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };

      // Create product in database
      const product = await productModel.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData,
      });

      res.status(201).json(product);
    } catch (error) {
      // console.error("Cloudinary upload error:", error);
      res.status(500);
      throw new Error("Image could not be uploaded to Cloudinary");
    }
  } else {
    // console.log("No image file received");
    res.status(400).send("No image file found.");
  }
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// Get single product
const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await product.deleteOne();
  res.status(200).json({ message: "Product deleted." });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await productModel.findById(id);

  // If product doesn't exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Initialize fileData
  let fileData = {};

  // If new image file is uploaded
  if (req.file) {
    try {
      const normalizedPath = path.normalize(req.file.path).replace(/\\/g, "/");

      const uploadedFile = await cloudinary.uploader.upload(normalizedPath, {
        folder: "Pinvent App",
        resource_type: "image",
      });

      // Delete local file after successful upload
      fs.unlink(normalizedPath, (err) => {
        if (err) {
          console.error("Error deleting local file:", err);
        } else {
          console.log("Local file deleted:", normalizedPath);
        }
      });

      // Set uploaded image data
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };

    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded to Cloudinary");
    }
  }

  // Update the product
  const updatedProduct = await productModel.findByIdAndUpdate(
    id,
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct
};
