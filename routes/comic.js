const express = require("express");
const axios = require("axios");

const { URL_BASE } = require("./default");
const isAuthenticatedPermissive = require("../middlewares/isAuthenticatedPermissive");
const {
  addFavoritesToMarvelArray,
  addFavoritesToMarvelItem,
} = require("../services/favorite.js");

const MARVEL_SK = process.env.MARVEL_SK;

const router = express.Router();

router.get("/comics", isAuthenticatedPermissive, async (req, res) => {
  const { limit, skip, title } = req.query;

  // Sanitize query in case of undefined or invalid
  const filters = {
    title: title || "",
    skip: skip >= 0 ? skip : "0",
    limit: limit > 0 && limit <= 100 ? limit : "100",
  };

  // Construct endpoint
  const searchParams = new URLSearchParams({
    apiKey: MARVEL_SK,
    ...filters,
  });
  const URL = `${URL_BASE}/comics?${searchParams}`;
  console.log(URL);

  try {
    const response = await axios.get(URL);
    // Add favorites for authenticated users
    if (req.user) {
      response.data.results = await addFavoritesToMarvelArray(
        req.user._id,
        "comics",
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
  "/comics/:characterId",
  isAuthenticatedPermissive,
  async (req, res) => {
    const { characterId } = req.params;

    const searchParams = new URLSearchParams({ apiKey: MARVEL_SK });
    const URL = `${URL_BASE}/comics/${characterId}?${searchParams}`;

    try {
      const response = await axios.get(URL);
      // Add favorites for authenticated users
      if (req.user) {
        // One character
        response.data = await addFavoritesToMarvelItem(
          req.user._id,
          "characters",
          response.data
        );

        // Many comics
        response.data.comics = await addFavoritesToMarvelArray(
          req.user._id,
          "comics",
          response.data.comics
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
  }
);

router.get("/comic/:comicId", isAuthenticatedPermissive, async (req, res) => {
  const { comicId } = req.params;

  const searchParams = new URLSearchParams({ apiKey: MARVEL_SK });
  const URL = `${URL_BASE}/comic/${comicId}?${searchParams}`;

  try {
    const response = await axios.get(URL);
    // Add favorites for authenticated users
    if (req.user) {
      response.data = await addFavoritesToMarvelItem(
        req.user._id,
        "comics",
        response.data
      );
    }
    res.json(response.data);
  } catch (error) {
    if (error.response?.data) {
      // axios failed?
      console.error(error.response.data.message);
      res.status(500).json({ message: error.response.data.message });
    } else {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
