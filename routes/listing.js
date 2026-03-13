const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const Listing = require("../models/listing");



//validatinglisting

const validateListing = (req, res, next) =>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMst = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

app.use("/listings", listings);


//Index Route

router.get("/", wrapAsync (async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//Create : New & Create Route
router.get("/new", (req , res) =>{
    res.render("listings/new.ejs");
});



 //show route
router.get("/:id",wrapAsync  (async (req , res ) => {
    let {id} = req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing});
}));

 //create route
 router.post("/", validateListing, wrapAsync (async (req , res , next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
 })
 );



 // edit Route
     
 router.get("/", wrapAsync  (async (req , res )=> {
    let {id} = req.params;
     const listing=await Listing.findById(id);
     res.render("listings/edit.ejs", {listing});
 })); 
 
 //Update Route
 router.put("/:id",validateListing ,wrapAsync (async (req , res) => {
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing });
     res.redirect(`/listings/${id}`);
 }));
 
 
 //delete Route
 
 router.delete("/:id", wrapAsync  (async (req , res ) => {
     let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
 })
);

module.exports = router;