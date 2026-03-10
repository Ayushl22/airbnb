const express = require("express");
const router = express.Router();

const { listingSchema } = require("../schema");

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");

const { isLoggedIn, isOwner } = require("../middleware");

const listingController = require("../controllers/listings");

const multer = require("multer");
const {storage}=require("../cloudCOnfig");
const upload = multer({storage})
// ======================
// Validation Middleware
// ======================

const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



// ======================
// NEW Route
// ======================

router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);

// ======================
// EDIT Route
// ======================

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


router.route("/")
.get(wrapAsync(listingController.index)) 
.post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
);

router.route("/:id")
.get(
    wrapAsync(listingController.showListing)
)
.put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);


// ======================
// INDEX Route
// ======================

// router.get("/",
//     wrapAsync(listingController.index)
// );





// ======================
// SHOW Route
// ======================

// router.get("/:id",
//     wrapAsync(listingController.showListing)
// );


// ======================
// CREATE Route
// ======================

// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );





// ======================
// UPDATE Route
// ======================

// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)
// );


// ======================
// DELETE Route
// ======================

// router.delete("/:id",
//     isLoggedIn,
//     isO.wner,
//     wrapAsync(listingController.deleteListing)
// );


module.exports = router;