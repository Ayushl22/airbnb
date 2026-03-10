const Listing = require("./models/listing");
const Review = require("./models/review");


// ======================
// Check if Logged In
// ======================

module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "You must be logged in to create listing");

    return res.redirect("/login");
  }

  next();
};


// ======================
// Save Redirect URL
// ======================

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
};


// ======================
// Check Listing Owner
// ======================

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner");

    return res.redirect(`/listings/${id}`);
  }

  next();
};

// ======================
// Check Review Author
// ======================

module.exports.isReviewAuthor = async (req, res, next) => {

  const { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {

    req.flash("error", "You are not the author of this review");

    return res.redirect(`/listings/${id}`);
  }

  next();
};