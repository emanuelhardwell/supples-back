const express = require("express");
const morgan = require("morgan");
const { dbConnection } = require("./db/db");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  errorMiddleware,
  notFoundMiddleware,
} = require("./middlewares/error.middlewares");

dotenv.config();

const app = express();

// DB connection
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));

// middleware routes
app.use(errorMiddleware);
app.use(notFoundMiddleware);

// Server
app.listen(process.env.PORT || 6000, () =>
  console.log(`Server running in the port ${process.env.PORT}`)
);
