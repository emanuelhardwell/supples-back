const { Router } = require("express");
const {
  createCategory,
  updateCategory,
  getCategories,
  getCategory,
  deleteCategory,
} = require("../controllers/category.controllers");
const schemaValidate = require("../middlewares/schemaValidate.middlewares");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../schemas/category.schema");

const routerCategory = Router();

routerCategory.get("/", getCategories);

routerCategory.get("/:id", getCategory);

routerCategory.post("/", schemaValidate(createCategorySchema), createCategory);

routerCategory.put(
  "/:id",
  schemaValidate(updateCategorySchema),
  updateCategory
);

routerCategory.delete("/:id", deleteCategory);

module.exports = routerCategory;
