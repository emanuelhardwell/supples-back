const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");
const Cart = require("./Cart.model");
const Product = require("./Product.model");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Product.belongsToMany(Cart, {
  through: "CartItem",
  foreignKey: "productId",
  otherKey: "cartId",
});
Cart.belongsToMany(Product, {
  through: "CartItem",
  foreignKey: "cartId",
  otherKey: "productId",
});

module.exports = CartItem;
