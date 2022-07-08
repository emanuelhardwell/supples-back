const { Router } = require("express");
const {
  createCartItem,
  updateCartItem,
  getCartItems,
  getCartItem,
  deleteCartItem,
} = require("../controllers/CartItem.controllers");
const schemaValidate = require("../middlewares/schemaValidate.middlewares");
const { validateJwt } = require("../middlewares/validateJwt.middleware");
const { createCartItemSchema } = require("../schemas/cartItem.schema");

const routerCartItem = Router();

routerCartItem.use(validateJwt);

routerCartItem.get("/", getCartItems);

routerCartItem.get("/:id", getCartItem);

routerCartItem.post("/", schemaValidate(createCartItemSchema), createCartItem);

routerCartItem.put("/", updateCartItem);

// routerCartItem.put(
//   "/:id",
//   schemaValidate(updateCartItemSchema),
//   updateCartItem
// );

routerCartItem.delete("/:id", deleteCartItem);

module.exports = routerCartItem;
