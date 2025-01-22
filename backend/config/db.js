const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb is connected");
  } catch (error) {
    console.log("MongoDb Connection failed", error.message);
  }
};
module.exports = connectDB;
