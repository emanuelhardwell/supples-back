const express = require("express");
const morgan = require("morgan");
const dbConnection = require("./db/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// DB connection
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes

// Server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running in the port ${process.env.PORT}`)
);
