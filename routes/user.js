const express = require("express");
const router = express.Router();

const passport = require("passport");

const userController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");



router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);



// // ======================
// // SIGNUP FORM
// // ======================

// router.get("/signup", userController.renderSignupForm);


// // ======================
// // SIGNUP LOGIC
// // ======================

// router.post("/signup", userController.signup);


// // ======================
// // LOGIN FORM
// // ======================

// router.get("/login", userController.renderLoginForm);


// // ======================
// // LOGIN LOGIC
// // ======================

// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true,
//     }),
//     userController.login
// );


// ======================
// LOGOUT
// ======================

router.get("/logout", userController.logout);


module.exports = router;