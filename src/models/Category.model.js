const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");
const Product = require("./Product.model");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Category.hasMany(Product, {
  foreignKey: "categoryId",
  sourceKey: "id",
});

Product.belongsTo(Category, { foreignKey: "categoryId", targetKey: "id" });

module.exports = Category;
