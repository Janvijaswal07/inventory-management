const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Token = require("../models/tokenSet");
const sendEmail = require("../config/sendEmail");

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// register user
const registerUser = asyncHandler(async (req, res) => {
  //validation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password < 6) {
    res.status(400);
    throw new Error("Password must be upto 6 character");
  }

  // if user already exist
  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("User is already existed");
  }

  //create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //generate token
  const token = generateToken(user._id);

  //send cookie to brower
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, phone, photo, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      photo,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //valodation
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill email and password");
  }

  //check user is existed
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User is not exist, please signup first");
  }
  // check password is correct
  const passwordValidation = await bcrypt.compare(password, user.password);

  //generate token
  const token = generateToken(user._id);

  //send cookie to brower
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user && passwordValidation) {
    const { _id, name, email, phone, photo, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      photo,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//logut user
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Sucessfully logged out" });
});

// get user data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, phone, photo, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      photo,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//  Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.json(false);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, email, phone, photo, bio } = user;

    user.name = req.body.name || name;
    user.email = email;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      photo: updatedUser.photo,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User is not found");
  }
});

// update password

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User is not found, Please login first");
  }

  // validate
  if (!password || !oldPassword) {
    res.status(400);
    throw new Error("Please add oldpassword and new password");
  }

  // if oldpassword is matches to mongoDB password
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error(
      "your old password is wrong, please enter the rigth password"
    );
  }
  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successfully");
  } else {
    res.status(400);
    throw new Error("Please add old and new passowrd");
  }
});

//forgotpassword
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("email not exist");
  }
  //delete the token if already exists in db
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await Token.deleteOne();
  }

  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // hash token before save in DB
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await Token.create({
    userId: user._id,
    token: hashToken,
    createdAT: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //after 30 min
  });

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
  console.log(resetToken);
  const message = `
  <h2>Hello  ${user.name} </h2>
  <p>Please use the URL below to reset your password</p>
  <p>This Reset URL is valid for 30 Minutes</p>

  <a href=${resetUrl}  clicktracking=off >${resetUrl}</a>
   
  <p>Regards...</p>
  <h3>Pinvent team</h3>
  
  `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);
    res.status(200);
    res.json({ success: true, message: "Reset Email Sent Successfully " });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, Please try again later");
  }
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { passowrd } = req.body;
  const { resetToken } = req.params;

  // hash token, then compare  to Token in Db
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //find token in  DB and also check the expire time of the token
  const userToken = await Token.findOne({
    token: hashToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid token, Expired token");
  }

  // find user
  const user = await User.findOne({ _id: userToken.userId });
  user.passowrd = passowrd;
  await user.save();
  res.status(200);
  throw new Error("Password reset successfully, please login");
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
