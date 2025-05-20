const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be up to 6 character"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5jifLXKb2qo_5aXh54USNlvxI34oPpG3zTw&s",
    },
   
    phone: {
      type: String,
      default: "+123",
    },
    bio: {
      type: String,
      maxLength: [250, "bio must be not more then 250 character"],
      default: "bio",
    },
  },
  {
    timestamps: true,
  }
);

//hasded password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
