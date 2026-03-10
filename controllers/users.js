const User = require("../models/user");


// ======================
// RENDER SIGNUP FORM
// ======================

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// ======================
// SIGNUP LOGIC
// ======================

module.exports.signup = async (req, res, next) => {
    try {

        let { username, email, password } = req.body;

        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "User registered successfully!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};


// ======================
// RENDER LOGIN FORM
// ======================

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// ======================
// LOGIN SUCCESS
// ======================

module.exports.login = async (req, res) => {

    req.flash("success", "Welcome back!");

    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);

};


// ======================
// LOGOUT
// ======================

module.exports.logout = (req, res, next) => {

    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out");

        res.redirect("/listings");
    });

};