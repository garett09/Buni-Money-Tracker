const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "*" }));

//Test API
app.post("/hello", async (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});
app.listen(8000);
module, (exports = app);
