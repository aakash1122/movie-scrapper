const fs = require("fs");
const Puppeteer = require("puppeteer");
const express = require("express");

const getMovieData = require("./lib/script");

const app = express();

getMovieData();

app.get("*", async (req, res) => {
  try {
    let data = await getMovieData();
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("server running on port 3000"));
