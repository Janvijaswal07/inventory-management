const dotenv = require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParse = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routers/userRoutes");
const errorHandler = require('./middleware/errorMiddleware')

const app = express()

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(cookieParser());

// routes middleware
app.use("/api/", userRoutes);

const Port = process.env.Port || 5000;

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
