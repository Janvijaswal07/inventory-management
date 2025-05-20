const dotenv = require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParse = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routers/userRoutes");
const productRoutes = require("./routers/productRoute");
const contactRoute = require("./routers/contactRoute");
const errorHandler = require('./middleware/errorMiddleware')
const path = require("path");


const app = express()

//middlewares
app.use(express.json()); // For parsing JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(bodyParse.json());
app.use(cookieParser());
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://pinvent-app.vercel.app"],
      credentials: true,
    })
  );
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes middleware
app.use("/api/auth/", userRoutes);
app.use("/api/product/", productRoutes);
  app.use("/api/contactus", contactRoute);

const Port = process.env.Port || 6000;

//error middleware
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log(`server running at the ${Port}`);
    });
  })
  .catch((err) => {
    console.log(err.message, "mongoDB is not connected");
  });
