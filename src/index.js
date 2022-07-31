const express = require("express");
const morgan = require("morgan");
const { dbConnection } = require("./db/db");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  errorMiddleware,
  notFoundMiddleware,
} = require("./middlewares/error.middlewares");
const fileupload = require("express-fileupload");
const helmet = require("helmet");

dotenv.config();

const app = express();

// DB connection
dbConnection();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(fileupload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/category", require("./routes/category.routes"));
app.use("/api/v1/product", require("./routes/product.routes"));
app.use("/api/v1/cart-item", require("./routes/CartItem.routes"));

// middleware routes
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Server
app.listen(process.env.PORT || 6000, () =>
  console.log(`Server running in the port ${process.env.PORT}`)
);
