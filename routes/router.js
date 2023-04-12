const express = require("express");
const router = express.Router();
const {
  getHome,
  getProfile,
  postRegister,
  postSignin,
  postImages,
  postImgurl,
} = require("../controller/controller");

router.route("/").get(getHome);
router.route("/signin").post(postSignin);
router.route("/register").post(postRegister);
router.route("/profile/:id").get(getProfile);
router.route("/images").post(postImages);
router.route("/signin").post(postSignin);
router.route("/imgurl").post(postImgurl);

module.exports = router;
