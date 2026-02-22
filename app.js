const express =  require("express");
const app=express();
const mongoose= require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function 
main(){
    await mongoose.connect(MONGO_URL);
}

//ejs engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate );
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("server is working");
});

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





//validatingreview

const validateReview = (req, res, next) =>{
    let {error}=reviewSchema.validate(req.body);

    if(error){
        let errMst = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}









//Index Route

app.get("/listings", wrapAsync (async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//Create : New & Create Route
app.get("/listings/new", (req , res) =>{
    res.render("listings/new.ejs");
});



 //show route
app.get("/listings/:id",wrapAsync  (async (req , res ) => {
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs", { listing});
}));

 //create route
 app.post("/listings", validateListing, wrapAsync (async (req , res , next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
 })
 );

// edit Route
    
app.get("/listings/:id/edit", wrapAsync  (async (req , res )=> {
   let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})); 

//Update Route
app.put("/listings/:id",validateListing ,wrapAsync (async (req , res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
    res.redirect(`/listings/${id}`);
}));


//delete Route

app.delete("/listings/:id", wrapAsync  (async (req , res ) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//reviews post route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async(req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));




/*creating testListing
app.get("/testListing", async (req , res) => {
    let sampleListing = new Listing ({
    title : "my new villa",
    description: "by the beach",
    price:500000,
    location:"calangute,Goa",
    country : "India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});*/

//middlewares
// Catch all unmatched routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).render("error.ejs", {  message });
});

 
app.listen(3000, () => {
    console.log("server is listening to port 3000");
});