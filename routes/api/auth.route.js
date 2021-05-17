const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const authValidator = require("../../validators/authValidator");
const auth = require("../../middlewares/auth.middleware");
const limiter = require("express-rate-limit");

const createAccountLimiter = limiter({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 1, // start blocking after 5 requests
  message: {
    code: 429,
    msg: "Too many accounts created from this IP, please try again after an hour",
  },
});

/*
  @route api/auth/login
  @access public
*/
router.post("/login", authController.login);

router.get("/user", auth, authController.getUserInfo);
/*
  @route api/auth/register
  @access public
*/
router.post(
  "/register",
  createAccountLimiter,
  authValidator.registerValidator,
  authController.register
);

module.exports = router;
