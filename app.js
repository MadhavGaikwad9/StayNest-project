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
const listings = require("./routes/listing.js");
const session = require("express-session");
const flash = require("connect-flash");


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



const sessionOptions = {
    secret: "mysupersecretcode",
    resave:false,
    saveUnitialized:true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:+ 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());



app.get("/", (req, res) => {
    res.send("server is working");
});





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

//reviews post route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async(req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));


//delete Review route

app.delete("/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {

    let { id, reviewId } = req.params;

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    // Redirect to listing page
    res.redirect(`/listings/${id}`);
  })
);





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