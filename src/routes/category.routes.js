const { Router } = require("express");
const {
  createCategory,
  updateCategory,
  getCategories,
  getCategory,
  deleteCategory,
} = require("../controllers/category.controllers");
const schemaValidate = require("../middlewares/schemaValidate.middlewares");
const { validateJwt } = require("../middlewares/validateJwt.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../schemas/category.schema");
const apicache = require("apicache");
const cache = apicache.middleware;

const routerCategory = Router();

routerCategory.use(validateJwt);

routerCategory.get("/", cache("4 minutes"), getCategories);

routerCategory.get("/:id", cache("4 minutes"), getCategory);

routerCategory.post("/", schemaValidate(createCategorySchema), createCategory);

routerCategory.put(
  "/:id",
  schemaValidate(updateCategorySchema),
  updateCategory
);

routerCategory.delete("/:id", deleteCategory);

module.exports = routerCategory;
