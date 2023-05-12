const User = require("../models/User");

const checkCollection = (collection) => {
  if (collection !== "comics" && collection !== "characters") {
    throw new Error(
      "Invalid argument: collection must be comics or characters"
    );
  }
};

/** Augment Marvel data with user data  */
const addFavoritesToMarvelArray = async (userId, collection, results) => {
  checkCollection(collection);

  // Get fresh data
  const user = await User.findById(userId);
  // Get favorites
  const favSet = new Set(user.favorites[collection]);
  // Left join
  results.forEach((result) => {
    result.favorite = favSet.has(result._id);
  });
  return results;
};

/** Augment Marvel item with user data */
const addFavoritesToMarvelItem = async (userId, collection, result) => {
  const results = await addFavoritesToMarvelArray(userId, collection, [result]);
  return results[0];
};

/** Add new favorite to user data */
const addToFavorites = async (userId, collection, itemId) => {
  checkCollection(collection);

  // Get fresh data
  const user = await User.findById(userId);
  // Get favorites
  const favSet = new Set(user.favorites[collection]);
  favSet.add(itemId);

  // Update DB
  // new object to be safe
  // cast to simple array (could type as a set)
  const newFavorites = { ...user.favorites, [collection]: [...favSet] };
  const result = await User.findByIdAndUpdate(userId, {
    favorites: newFavorites,
  });
  // return favorites
  return result.favorites[collection];
};

/** Remove favorite from user data */
const removeFromFavorites = async (userId, collection, itemId) => {
  checkCollection(collection);

  // Get fresh data
  const user = await User.findById(userId);
  // Get favorites
  const favSet = new Set(user.favorites[collection]);
  favSet.remove(itemId);

  // Update DB
  // new object to be safe
  // cast to simple array (could type as a set)
  const newFavorites = { ...user.favorites, [collection]: [...favSet] };
  const result = await User.findByIdAndUpdate(userId, {
    favorites: newFavorites,
  });
  // return favorites
  return result.favorites[collection];
};

module.exports = {
  addFavoritesToMarvelArray,
  addFavoritesToMarvelItem,
  addToFavorites,
  removeFromFavorites,
};
