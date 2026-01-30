const fs = require("fs");
const path = require("path");
const ApiError = require("../utils/ApiError");

const addHome = (req, res, next) => {
  try {
    const { title, description, price_per_night, image } = req.body;
    if (!title || !description || !price_per_night || !image) {
      throw new ApiError(
        400,
        "Missing required fields: title, description, price_per_night, image",
      );
    }
    const listingsPath = path.join(__dirname, "../db/home.db.json");
    fs.readFile(listingsPath, "utf8", (err, data) => {
      if (err) {
        throw new ApiError(500, "Error reading listings file");
      }
      const listings = JSON.parse(data);
      const newListing = {
        id: listings.length + 1,
        title,
        description,
        price_per_night: parseInt(price_per_night),
        image,
      };
      listings.push(newListing);
      fs.writeFile(listingsPath, JSON.stringify(listings, null, 2), (err) => {
        if (err) {
          throw new ApiError(500, "Error writing to listings file");
        }
        res.status(201).json({
          message: "Home listing added successfully",
          listing: newListing,
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addHome };
