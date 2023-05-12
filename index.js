const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const comicRoutes = require("./routes/comic");
const characterRoutes = require("./routes/character");

// console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);

app.get("/", (req, res) => {
  console.log("Hello World");
  res.json({ message: "Hello World" });
});

app.use(authRoutes);
app.use(userRoutes);
app.use(comicRoutes);
app.use(characterRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT}`);
});
