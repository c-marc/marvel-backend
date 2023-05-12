const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { addToFavorites, removeFromFavorites } = require("../services/favorite");

const router = express.Router();

// Use middleware as an endpoint
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const securedUser = req.user;

    res.json(securedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add an item to the appropriate favorite collection
router.post(
  "/user/favorites/:collection/:itemId",
  isAuthenticated,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { collection, itemId } = req.params;
      const newFavorites = await addToFavorites(userId, collection, itemId);
      res.json(newFavorites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Remove an item from the appropriate favorite collection
router.delete(
  "/user/favorites/:collection/:itemId",
  isAuthenticated,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { collection, itemId } = req.params;
      const newFavorites = await removeFromFavorites(
        userId,
        collection,
        itemId
      );
      res.json(newFavorites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
