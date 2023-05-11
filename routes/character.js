const express = require("express");
const axios = require("axios");

const { URL_BASE } = require("./default");
const MARVEL_SK = process.env.MARVEL_SK;

const router = express.Router();

router.get("/characters", async (req, res) => {
  const { limit, skip, name } = req.query;

  // For prettier query, get rid of falsy values
  const filters = {
    name: name || "",
    skip: (skip && skip >= 0) || "0",
    limit: (limit && limit > 0 && limit <= 100) || "100",
  };

  const searchParams = new URLSearchParams({
    apiKey: MARVEL_SK,
    ...filters,
  });
  console.log(searchParams);

  const URL = `${URL_BASE}/characters?${searchParams}`;
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

router.get("/character/:characterId", async (req, res) => {
  const { characterId } = req.params;

  const searchParams = new URLSearchParams({ apiKey: MARVEL_SK });
  const URL = `${URL_BASE}/character/${characterId}?${searchParams}`;

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
