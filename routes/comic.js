const express = require("express");
const axios = require("axios");

const { URL_BASE } = require("./default");
const MARVEL_SK = process.env.MARVEL_SK;

const router = express.Router();

router.get("/comics", async (req, res) => {
  const { limit, skip, title } = req.query;

  // For prettier query, get rid of falsy values
  const filters = {
    title: title || "",
    skip: (skip && skip >= 0) || "0",
    limit: (limit && limit > 0 && limit <= 100) || "100",
  };

  const searchParams = new URLSearchParams({
    apiKey: MARVEL_SK,
    ...filters,
  });
  console.log(searchParams);

  const URL = `${URL_BASE}/comics?${searchParams}`;
  console.log(URL);

  try {
    const response = await axios.get(URL);
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
});

router.get("/comics/:characterId", async (req, res) => {
  const { characterId } = req.params;

  const searchParams = new URLSearchParams({ apiKey: MARVEL_SK });
  const URL = `${URL_BASE}/comics/${characterId}?${searchParams}`;

  try {
    const response = await axios.get(URL);
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
});

router.get("/comic/:comicId", async (req, res) => {
  const { comicId } = req.params;

  const searchParams = new URLSearchParams({ apiKey: MARVEL_SK });
  const URL = `${URL_BASE}/comic/${comicId}?${searchParams}`;

  try {
    const response = await axios.get(URL);
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
});

module.exports = router;
