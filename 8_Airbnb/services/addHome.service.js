const fs = require("fs").promises;
const path = require("path");
const ApiError = require("../utils/ApiError");

const addNewHome = async ({
  title,
  description,
  location,
  price_per_night,
  image,
}) => {
  if (!title || !description || !price_per_night || !image || !location) {
    throw new ApiError(
      400,
      "Missing required fields: title, description, price_per_night, image, location",
    );
  }

  const listingsPath = path.join(__dirname, "../db/home.db.json");
  try {
    const data = await fs.readFile(listingsPath, "utf8");
    const listings = JSON.parse(data);
    const newListing = {
      id: listings.length + 1,
      title,
      description,
      location,
      price_per_night: parseInt(price_per_night),
      image,
    };
    listings.push(newListing);
    await fs.writeFile(listingsPath, JSON.stringify(listings, null, 2));
    return newListing;
  } catch (err) {
    throw new ApiError(500, "Error accessing listings file");
  }
};

module.exports = { addNewHome };
