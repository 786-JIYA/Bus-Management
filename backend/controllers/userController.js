const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    //create new user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    return res.status(200).json({
      status: "success",
      token,
      message: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "Fail",
        message: "Please provide email or password",
      });
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "Fail",
        message: "Incorrect email or password",
      });
    }

    const token = signToken(user._id);

    res.status(201).json({
      status: "succes",
      token,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.protect = async (req, res, next) => {
  //getting token and to check if it is there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! please log in to get access",
    });
  }

  //verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "The user belonging to this token does no longer exist",
    });
  }
  console.log(decoded);
  next();
};
