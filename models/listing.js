const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:false,
    },
    image:{
    filename: String,
    url: String,
    },
    price:{
        type:Number,
        default: 0,
    },
    location:String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;