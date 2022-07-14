const { Router } = require("express");
const {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
  getProductsByPagination,
} = require("../controllers/product.controllers");
const schemaValidate = require("../middlewares/schemaValidate.middlewares");
const { validateJwt } = require("../middlewares/validateJwt.middleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("../schemas/product.schema");

const routerProduct = Router();

routerProduct.use(validateJwt);

routerProduct.get("/", getProducts);

routerProduct.get("/products", getProductsByPagination);

routerProduct.get("/:id", getProduct);

routerProduct.post("/", schemaValidate(createProductSchema), createProduct);

routerProduct.put("/:id", schemaValidate(updateProductSchema), updateProduct);

routerProduct.delete("/:id", deleteProduct);

module.exports = routerProduct;
