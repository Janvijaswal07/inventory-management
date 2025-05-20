const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the new upload directory (in the root of the project)
const uploadDir = path.join(__dirname, "..", "uploads"); // Goes one level up from utils

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Define multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to the new upload directory
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Add the fileSizeFormatter function back
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index];
};

module.exports = { upload, fileSizeFormatter };
