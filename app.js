const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const ExpressError = require("./utils/ExpressError");
const { storeUserInLocals } = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const listingRoutes = require("./routes/listingRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const Listing = require("./models/Listing");

dotenv.config();
connectDB();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "staynest-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(storeUserInLocals);

app.get("/", async (req, res, next) => {
  try {
    const featuredListings = await Listing.find({}).sort({ createdAt: -1 }).limit(6).populate("owner");
    res.render("home", { featuredListings });
  } catch (err) {
    next(err);
  }
});

app.use("/listings", listingRoutes);
app.use("/listings", reviewRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});