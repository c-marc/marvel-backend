const express = require("express");
const axios = require("axios");

const { URL_BASE } = require("./default");
const isAuthenticatedPermissive = require("../middlewares/isAuthenticatedPermissive");

const {
  addFavoritesToMarvelArray,
  addFavoritesToMarvelItem,
} = require("../services/favorite");

const MARVEL_SK = process.env.MARVEL_SK;

const router = express.Router();

router.get("/characters", isAuthenticatedPermissive, async (req, res) => {
  const { limit, skip, name } = req.query;

  // Sanitize undefined or invalid searchParams
  const filters = {
    name: name || "",
    skip: skip >= 0 ? skip : "0",
    limit: limit > 0 && limit <= 100 ? limit : "100",
  };

  // Create endpoint
  const searchParams = new URLSearchParams({
    apiKey: MARVEL_SK,
    ...filters,
  });
  const URL = `${URL_BASE}/characters?${searchParams}`;
  console.log(URL);

  try {
    const response = await axios.get(URL);
    // Add favorites for authenticated users
    if (req.user) {
      response.data.results = await addFavoritesToMarvelArray(
        req.user._id,
        "characters",
        response.data.results
      );
    }
    res.json(response.data);
  } catch (error) {
    if (error.response?.data) {
      // axios failed ?
      console.error(error.response.data.message);
      res.status(500).json({ message: error.response.data.message });
    } else {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
});

router.get(
  "/character/:characterId",
  isAuthenticatedPermissive,
  async (req, res) => {
    const { characterId } = req.params;

    const searchParams = new URLSearchParams({ apiKey: MARVEL_SK });
    const URL = `${URL_BASE}/character/${characterId}?${searchParams}`;

    try {
      const response = await axios.get(URL);
      // Add favorites for authenticated users
      if (req.user) {
        response.data = await addFavoritesToMarvelItem(
          req.user._id,
          "characters",
          response.data
        );
      }
      res.json(response.data);
    } catch (error) {
      if (error.response?.data) {
        // axios failed
        console.error(error.response.data.message);
        res.status(500).json({ message: error.response.data.message });
      } else {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      }
    }
  }
);

module.exports = router;
