const express = require("express");
const ms = require("ms");
const router = express.Router();
const jwt = require("jsonwebtoken");
const rateLimit= require('express-rate-limit');
const bcrypt = require("bcrypt");
const isProd = process.env.NODE_ENV === "production";
const userEntity = require("../model/user.model");
//fx
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    return res.render("pages/login", {
      layout: false,
      success: false,
      mess: "Too many login attempts. Please try again in 15 minutes."
    });
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false
});
async function comparePassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}
//form login
router.get("/admin/login", (req, res) => {
  res.render("pages/login", { layout: false });
});
//login
router.post("/admin/login",loginLimiter , async (req, res) => {
  const { email, password } = req.body;
  const account = await userEntity.findOne({ email: email });
  if (!account) {
    // console.log("ko thay user");
    return res.render("pages/login", {
      layout: false,
      success: false,
      mess: "username or password is incorrect!",
    });
  }
  if(!account.status){
    return res.render("pages/login", {
      layout: false,
      success: false,
      mess: "Your account has been banned. Please contact the administrator.",
    });
  }
  const match = await comparePassword(password, account.password);

  if (!match) {
    // return res.status(401).json({success: false, mess: 'Sai mat khau'});
    return res.render("pages/login", {
      layout: false,
      success: false,
      mess: "username or password is incorrect!!",
    });
  }
  const payload = {
        id: account._id,
        role: account.role
    }
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: ms(process.env.JWT_EXPIRE),
  });
  res.redirect("/admin");
  // res.json({success: true, data: 'login success', token})
});
//logout
router.post("/admin/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});
// register
router.get("/admin/register", async (req, res) => {
  console.log('Test')
  try {
    const { email, password } = { email: "admin@gmail.com", password: "123@" };
    const exitAccount = await userEntity.findOne({ email });
    if (exitAccount) {
      return res
        .status(400)
        .json({ success: false, data: "da ton tai account nay" });
    }
    //hash password
    const hashPassword = await bcrypt.hash(password, 10);
    const uDTO = new userEntity({
      email: email,
      password: hashPassword,
      username: "ces_toppilife",
      name: "Ces-Toppilife Admin"
    });
    await uDTO.save();
    res.json({ success: true, data: "creating user is success" });
    // {email, hashPassword};
  } catch (error) {
    console.log(CNAME, error.message);
    res
      .status(500)
      .json({ success: false, mess: "Creating account is failed" });
  }
});
module.exports = router;
