# StayNest

StayNest is a polished Airbnb-inspired accommodation platform built with Node.js, Express, MongoDB, EJS, and Bootstrap. It now includes authentication, authorization, reviews, bookings, search filters, and a modern portfolio-style UI.

## Features
- User registration and login
- Secure password hashing
- Listing creation, editing, and deletion
- Search and filtering by location, category, price, and sort order
- Review and rating system
- Booking flow with check-in/check-out and guest selection
- Responsive premium UI with Bootstrap

## Tech Stack
- Frontend: EJS, Bootstrap, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Security: Helmet, rate limiting, session-based auth

## Project Structure
- app.js
- config/
- controllers/
- models/
- routes/
- middleware/
- validators/
- views/
- public/
- seeds/

## Installation
1. Install dependencies: npm install
2. Create a .env file using .env.example
3. Start MongoDB locally
4. Run: npm run seed
5. Start the app: npm start

## Environment Variables
- MONGO_URL
- SESSION_SECRET
- PORT
- CLOUDINARY_NAME
- CLOUDINARY_KEY
- CLOUDINARY_SECRET

## Author
Madhav Gaikwad
