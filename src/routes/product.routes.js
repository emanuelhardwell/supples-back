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
const apicache = require("apicache");
const cache = apicache.middleware;

const routerProduct = Router();

routerProduct.use(validateJwt);

routerProduct.get("/", getProducts);

routerProduct.get("/products", cache("4 minutes"), getProductsByPagination);

routerProduct.get("/:id", cache("4 minutes"), getProduct);

routerProduct.post("/", schemaValidate(createProductSchema), createProduct);

routerProduct.put("/:id", schemaValidate(updateProductSchema), updateProduct);

routerProduct.delete("/:id", deleteProduct);

module.exports = routerProduct;
