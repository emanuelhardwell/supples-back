const { response } = require("express");
const {
  responseError500,
  responseSuccessfully,
  responseErrorCode,
} = require("../helpers/handleResponse");
const Cart = require("../models/Cart.model");
const CartItem = require("../models/CartItem.model");
const Product = require("../models/Product.model");

const cartItemCtrl = {};

cartItemCtrl.getCartItem = async (req, res = response) => {
  const { id } = req.params;

  try {
    let cartItem = await CartItem.findOne({ where: { id } });

    if (!cartItem) {
      return responseErrorCode(res, "Este producto del carrito no existe", 404);
    }

    responseSuccessfully(res, "Producto del carrito encontrado", 200, {
      cartItem,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

cartItemCtrl.getCartItems = async (req, res = response) => {
  try {
    const { cart } = req;
    // let cartItems = await CartItem.findAll({
    //   where: { cartId: cart },
    // });

    // Se puede usar estos metodos que nos GENERA SEQUELIZE cuando usamos la relacion MANY-MANY
    // const cartCart = await Cart.findByPk(cart);
    // const cartItems = await cartCart.getProducts();
    const cartItems = await Cart.findByPk(cart, {
      attributes: { exclude: ["userId"] },
      include: [
        { model: Product, attributes: ["id", "name", "price", "imageUrl"] },
      ],
    });

    if (!cartItems) {
      return responseErrorCode(
        res,
        "Estos productos del carrito no existe",
        404
      );
    }

    responseSuccessfully(res, "Productos del carrito obtenidos", 200, {
      cartItems,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

cartItemCtrl.getCartItemsQuantity = async (req, res = response) => {
  try {
    const { cart } = req;
    let cartItems = await CartItem.findAll({
      where: { cartId: cart },
    });

    if (!cartItems) {
      return responseErrorCode(res, "Este producto del carrito no existe", 404);
    }

    if (cartItems.length < 1) {
      cartItems = 0;
    } else {
      cartItems = cartItems
        .map((item) => item.quantity)
        .reduce((count, item) => count + item, 0);
    }

    responseSuccessfully(res, "Producto del carrito obtenidos", 200, {
      cartItems,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

// cartItemCtrl.createCartItem = async (req, res = response) => {
//   const { productId } = req.body;
//   const { cart } = req;

//   try {
//     let cartItem = await CartItem.findOne({
//       where: { cartId: cart, productId },
//     });

//     if (cartItem) {
//       cartItem.quantity = cartItem.quantity + 1;

//       if (cartItem.quantity > 15) {
//         return responseErrorCode(
//           res,
//           "La cantidad maxima de este producto es 15",
//           400
//         );
//       }
//       await cartItem.save();
//       return responseSuccessfully(res, "CartItem se actualizo", 200, {
//         cartItem: cartItem,
//       });
//     }

//     cartItem = req.body;
//     cartItem.cartId = cart;

//     const cartItemSaved = await CartItem.create(cartItem);

//     responseSuccessfully(res, "CartItem creado", 200, {
//       cartItem: cartItemSaved,
//     });
//   } catch (error) {
//     responseError500(res, error);
//   }
// };

cartItemCtrl.createCartItem = async (req, res = response) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  try {
    const cartItem = await Cart.findByPk(cart);
    if (!cartItem) {
      return responseErrorCode(res, "Este carrito no existe", 404);
    }

    const cartProduct = await Product.findByPk(productId);
    if (!cartProduct) {
      return responseErrorCode(res, "Este producto no existe", 404);
    }

    await cartItem.addProduct(cartProduct, {
      through: { quantity: quantity },
    });

    const cartItemSaved = await Cart.findByPk(cart, {
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "imageUrl"],
          through: { where: { productId: cartProduct.id } },
        },
      ],
    });
    if (!cartItemSaved) {
      return responseErrorCode(
        res,
        "Este producto no se pudo agregar al carrito",
        404
      );
    }

    responseSuccessfully(res, "Producto agregado al carrito", 200, {
      cartItem: cartItemSaved,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

cartItemCtrl.updateCartItem = async (req, res = response) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  try {
    const cartItem = await Cart.findByPk(cart);
    if (!cartItem) {
      return responseErrorCode(res, "Este carrito no existe", 404);
    }

    const cartProduct = await Product.findByPk(productId);
    if (!cartProduct) {
      return responseErrorCode(res, "Este producto no existe", 404);
    }

    await cartItem.addProduct(cartProduct, {
      through: { quantity: quantity },
    });

    const cartItemSaved = await Cart.findByPk(cart, {
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "imageUrl"],
          through: { where: { productId: cartProduct.id } },
        },
      ],
    });
    if (!cartItemSaved) {
      return responseErrorCode(
        res,
        "Este producto no se pudo agregar al carrito",
        404
      );
    }

    responseSuccessfully(res, "Producto del carrito actualizado", 200, {
      cartItem: cartItemSaved,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

// cartItemCtrl.updateCartItem = async (req, res = response) => {
//   const { id } = req.params;

//   try {
//     let cartItem = await CartItem.findOne({ where: { id } });

//     if (!cartItem) {
//       return responseErrorCode(res, "Este cartItem no existe", 404);
//     }

//     const cartItemSaved = await CartItem.update(req.body, {
//       where: { id },
//     });

//     if (cartItemSaved[0] !== 1) {
//       return responseErrorCode(res, "Error al actualizar el cartItem", 404);
//     }

//     const cartItemUpdated = await CartItem.findByPk(id);

//     responseSuccessfully(res, "CartItem actualizado", 200, {
//       cartItem: cartItemUpdated,
//     });
//   } catch (error) {
//     responseError500(res, error);
//   }
// };

cartItemCtrl.deleteCartItem = async (req, res = response) => {
  const { id } = req.params;

  try {
    let cartItem = await CartItem.findOne({ where: { id } });

    if (!cartItem) {
      return responseErrorCode(res, "Este producto del carrito no existe", 404);
    }

    await CartItem.destroy({ where: { id } });

    responseSuccessfully(res, "Producto del carrito eliminado", 200, {});
  } catch (error) {
    responseError500(res, error);
  }
};

module.exports = cartItemCtrl;
