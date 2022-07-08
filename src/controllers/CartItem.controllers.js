const { response } = require("express");
const {
  responseError500,
  responseSuccessfully,
  responseErrorCode,
} = require("../helpers/handleResponse");
const CartItem = require("../models/CartItem.model");

const cartItemCtrl = {};

cartItemCtrl.getCartItem = async (req, res = response) => {
  const { id } = req.params;

  try {
    let cartItem = await CartItem.findOne({ where: { id } });

    if (!cartItem) {
      return responseErrorCode(res, "Este cartItem no existe", 404);
    }

    responseSuccessfully(res, "CartItem encontrado", 200, {
      cartItem,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

cartItemCtrl.getCartItems = async (req, res = response) => {
  try {
    let cartItems = await CartItem.findAll();

    responseSuccessfully(res, "CartItems obtenidos", 200, { cartItems });
  } catch (error) {
    responseError500(res, error);
  }
};

cartItemCtrl.createCartItem = async (req, res = response) => {
  const { productId } = req.body;
  const { cart } = req;

  try {
    let cartItem = await CartItem.findOne({
      where: { cartId: cart, productId },
    });

    if (cartItem) {
      cartItem.quantity = cartItem.quantity + 1;
      await cartItem.save();
      return responseSuccessfully(res, "CartItem se actualizo", 200, {
        cartItem: cartItem,
      });
    }
    cartItem = req.body;
    cartItem.cartId = cart;

    const cartItemSaved = await CartItem.create(cartItem);

    responseSuccessfully(res, "CartItem creado", 200, {
      cartItem: cartItemSaved,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

cartItemCtrl.updateCartItem = async (req, res = response) => {
  const { id } = req.params;

  try {
    let cartItem = await CartItem.findOne({ where: { id } });

    if (!cartItem) {
      return responseErrorCode(res, "Este cartItem no existe", 404);
    }

    const cartItemSaved = await CartItem.update(req.body, {
      where: { id },
    });

    if (cartItemSaved[0] !== 1) {
      return responseErrorCode(res, "Error al actualizar el cartItem", 404);
    }

    const cartItemUpdated = await CartItem.findByPk(id);

    responseSuccessfully(res, "CartItem actualizado", 200, {
      cartItem: cartItemUpdated,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

cartItemCtrl.deleteCartItem = async (req, res = response) => {
  const { id } = req.params;

  try {
    let cartItem = await CartItem.findOne({ where: { id } });

    if (!cartItem) {
      return responseErrorCode(res, "Este cartItem no existe", 404);
    }

    await CartItem.destroy({ where: { id } });

    responseSuccessfully(res, "CartItem eliminado", 200, {});
  } catch (error) {
    responseError500(res, error);
  }
};

module.exports = cartItemCtrl;
