const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Listing = require("../models/Listing");
const User = require("../models/User");
const bcrypt = require("bcrypt");

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/staynest");
  await Listing.deleteMany({});
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = new User({ username: "demo", email: "demo@staynest.com", password: hashedPassword });
  await user.save();

  const listings = [
    { title: "Goa Beach Villa", description: "Stylish villa with private pool and sunset views", image: { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80" }, price: 4200, location: "Baga", country: "India", category: "Beach", owner: user._id },
    { title: "Manali Mountain Cabin", description: "Cozy cabin with pine trees and mountain views", image: { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" }, price: 2800, location: "Solang Valley", country: "India", category: "Mountains", owner: user._id },
    { title: "Hyderabad City Loft", description: "Modern loft near major attractions", image: { url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80" }, price: 2200, location: "Banjara Hills", country: "India", category: "Cities", owner: user._id },
    { title: "Kerala Houseboat", description: "Peaceful floating stay on the backwaters", image: { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" }, price: 3100, location: "Alleppey", country: "India", category: "Luxury", owner: user._id },
    { title: "Jaipur Heritage Home", description: "Elegant heritage property with rooftop dining", image: { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80" }, price: 2600, location: "Old City", country: "India", category: "Trending", owner: user._id },
  ];

  await Listing.insertMany(listings);
  console.log("Seed data created");
  mongoose.connection.close();
};

seed().catch((err) => console.error(err));
