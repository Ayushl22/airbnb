// ======================
// ENV Configuration
// ======================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ======================
// Packages
// ======================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ======================
// Models & Utilities
// ======================
const User = require("./models/user");
const ExpressError = require("./utils/expressError");

// ======================
// Routes
// ======================
const listings = require("./routes/listing");
const review = require("./routes/review");
const user = require("./routes/user");

// ======================
// App Init
// ======================
const app = express();

// ======================
// MongoDB
// ======================
const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
  console.error("MongoDB URL missing in .env!");
  process.exit(1);
}

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ======================
// View Engine
// ======================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================
// Middleware
// ======================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Session
// ======================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});
store.on("error", e => console.log("SESSION STORE ERROR", e));

const sessionConfig = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 1000*60*60*24*3 }
};
app.use(session(sessionConfig));
app.use(flash());

// ======================
// Passport
// ======================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======================
// Flash + Current User
// ======================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ======================
// Routes
// ======================
app.use("/listings", listings);
app.use("/listings/:id/reviews", review);
app.use("/", user);

app.get("/", (req, res) => res.redirect("/listings"));

// ======================
// 404 + Error Handler
// ======================
app.use((req, res, next) => next(new ExpressError(404, "Page Not Found")));
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { message });
});

// ======================
// Server
// ======================
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));