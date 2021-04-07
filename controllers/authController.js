const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");
const Flash = require("../utils/Flash");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "Create A New Account",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please check your form");
    return res.render("pages/auth/signup", {
      title: "Create A New Account",
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let hashPassword = await bcrypt.hash(password, 11);
    let user = new User({
      username,
      email,
      password: hashPassword,
    });

    await user.save();
    req.flash("success", "User created successfully");
    res.redirect("/auth/login");
  } catch (e) {
    next(e);
  }
};

exports.loginGetController = (req, res, next) => {
  res.render("pages/auth/login", {
    title: "Login to Your Account",
    error: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please check your form");
    return res.render("pages/auth/login", {
      title: "Login to Your Account",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash("fail", "Please provide valid Credential");
      return res.render("pages/auth/login", {
        title: "Login to Your Account",
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("fail", "Please provide valid Credential");
      return res.render("pages/auth/login", {
        title: "Login to Your Account",
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      req.flash("success", "Successfully Logged In ");
      res.redirect("/dashboard");
    });
  } catch (e) {
    next(e);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/auth/login");
  });
};

exports.changePasswordGetController = (req, res, next) => {
  res.render("pages/auth/changePass", {
    title: "Change Your Password",
    flashMessage: Flash.getMessage(req),
  });
};

exports.changePasswordPostController = async (req, res, next) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    req.flash("fail", "Password does not matched ");
    return res.redirect("/auth/changePassword");
  }

  try {
    let match = await bcrypt.compare(oldPassword, req.user.password);

    if (!match) {
      req.flash("fail", "Old password does not matched");
      return res.redirect("/auth/changePassword");
    }

    let hash = await bcrypt.hash(newPassword, 11);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { password: hash } }
    );
    req.flash("success", "Password Updated Successfully");
    return res.redirect("/auth/changePassword");
  } catch (e) {
    next(e);
  }
};
