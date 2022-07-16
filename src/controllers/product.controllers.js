const { response } = require("express");
const {
  responseError500,
  responseSuccessfully,
  responseErrorCode,
} = require("../helpers/handleResponse");
const Product = require("../models/Product.model");
const fs = require("fs-extra");
const cloudinary = require("cloudinary");
const { Op } = require("sequelize");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productCtrl = {};

productCtrl.getProduct = async (req, res = response) => {
  const { id } = req.params;

  try {
    let product = await Product.findOne({ where: { id } });

    if (!product) {
      return responseErrorCode(res, "Este producto no existe", 404);
    }

    responseSuccessfully(res, "Producto encontrada", 200, {
      product,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

productCtrl.getProducts = async (req, res = response) => {
  try {
    let products = await Product.findAll();

    responseSuccessfully(res, "Productos obtenidos", 200, { products });
  } catch (error) {
    responseError500(res, error);
  }
};

productCtrl.getProductsByPagination = async (req, res = response) => {
  const { page = 1 } = req.query;
  const { name = "" } = req.query;
  const LIMIT = 6;
  let startIndex = (Number(page) - 1) * LIMIT;
  let numberOfPages;

  try {
    let { count, rows } = await Product.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      offset: startIndex,
      limit: LIMIT,
      order: [["createdAt", "ASC"]],
    });

    numberOfPages = Math.ceil(count / LIMIT);

    responseSuccessfully(res, "Productos obtenidos", 200, {
      numberOfPages: numberOfPages,
      currentPage: Number(page),
      products: rows,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

productCtrl.createProduct = async (req, res = response) => {
  const { name } = req.body;
  const file = req.files.image;

  try {
    let product = await Product.findOne({ where: { name } });

    if (product) {
      return responseErrorCode(res, "Este producto ya existe", 400);
    }

    // Se agrega la imagen
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "diet",
    });

    const productAddImage = req.body;
    productAddImage.imageUrl = result.secure_url;
    productAddImage.imageId = result.public_id;

    const productSaved = await Product.create(productAddImage);
    await fs.unlink(file.tempFilePath);

    responseSuccessfully(res, "Producto creado", 200, {
      product: productSaved,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

productCtrl.updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const file = req.files.image;

  try {
    let product = await Product.findOne({ where: { id } });

    if (!product) {
      return responseErrorCode(res, "Este producto no existe", 404);
    }

    //  imagen
    await cloudinary.v2.uploader.destroy(product.imageId);

    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "diet",
    });

    const productAddImage = req.body;
    productAddImage.imageUrl = result.secure_url;
    productAddImage.imageId = result.public_id;

    const productSaved = await Product.update(productAddImage, {
      where: { id },
    });
    await fs.unlink(file.tempFilePath);

    if (productSaved[0] !== 1) {
      return responseErrorCode(res, "Error al actualizar el producto", 404);
    }

    const productUpdated = await Product.findByPk(id);

    responseSuccessfully(res, "Producto actualizado", 200, {
      product: productUpdated,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

productCtrl.deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  try {
    let product = await Product.findOne({ where: { id } });

    if (!product) {
      return responseErrorCode(res, "Este producto no existe", 404);
    }

    await Product.destroy({ where: { id } });
    await cloudinary.v2.uploader.destroy(product.imageId);

    responseSuccessfully(res, "Producto eliminado", 200, {});
  } catch (error) {
    responseError500(res, error);
  }
};

module.exports = productCtrl;
