const Listing = require("../models/listing");


// ======================
// INDEX
// ======================

module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listings/index", { allListings });

};


// ======================
// NEW FORM
// ======================

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new");

};


// ======================
// SHOW LISTING
// ======================

module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });

};


// ======================
// CREATE LISTING
// ======================

module.exports.createListing = async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image={url,filename};
    

    await newListing.save();

    req.flash("success", "New listing created");

    res.redirect("/listings");

};


// ======================
// EDIT FORM
// ======================

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });

};


// ======================
// UPDATE LISTING
// ======================

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing updated");

    res.redirect(`/listings/${id}`);

};


// ======================
// DELETE LISTING
// ======================

module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted");

    res.redirect("/listings");

};