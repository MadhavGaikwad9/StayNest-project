const express =  require("express");
const app=express();
const mongoose= require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


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
})

//Index Route

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//Create : New & Create Route
app.get("/listings/new", (req , res) =>{
    res.render("listings/new.ejs");
});



 //show route
app.get("/listings/:id", async (req , res ) => {
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs", { listing});
});

 //creating a post new route 

 app.post("/listings", async (req , res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
 });

// edit Route

app.get("/listings/:id/edit", async (req , res )=> {
   let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}); 

//Update Route
app.put("/listings/:id", async (req , res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
    res.redirect(`/listings/${id}`);
})


//delete Route

app.delete("/listings/:id", async (req , res ) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});



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




app.listen(3000, () => {
    console.log("server is listening to port 3000");
})