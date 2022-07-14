const { response } = require("express");
const {
  responseError500,
  responseSuccessfully,
  responseErrorCode,
} = require("../helpers/handleResponse");
const Category = require("../models/Category.model");

const categoryCtrl = {};

categoryCtrl.getCategory = async (req, res = response) => {
  const { id } = req.params;

  try {
    let category = await Category.findOne({ where: { id } });

    if (!category) {
      return responseErrorCode(res, "Esta categoría no existe", 404);
    }

    responseSuccessfully(res, "Categoría encontrada", 200, {
      category,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

categoryCtrl.getCategories = async (req, res = response) => {
  try {
    let categories = await Category.findAll();

    responseSuccessfully(res, "Categorías obtenidas", 200, { categories });
  } catch (error) {
    responseError500(res, error);
  }
};

categoryCtrl.createCategory = async (req, res = response) => {
  const { name } = req.body;

  try {
    let category = await Category.findOne({ where: { name } });

    if (category) {
      return responseErrorCode(res, "Esta categoría ya existe", 400);
    }

    const categorySaved = await Category.create(req.body);

    responseSuccessfully(res, "Categoría creada", 200, {
      category: categorySaved,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

categoryCtrl.updateCategory = async (req, res = response) => {
  const { id } = req.params;

  try {
    let category = await Category.findOne({ where: { id } });

    if (!category) {
      return responseErrorCode(res, "Esta categoría no existe", 404);
    }

    const categorySaved = await Category.update(req.body, {
      where: { id },
    });

    if (categorySaved[0] !== 1) {
      return responseErrorCode(res, "Error al actualizar la categoría", 404);
    }

    const categoryUpdated = await Category.findByPk(id);

    responseSuccessfully(res, "Categoría actualizada", 200, {
      category: categoryUpdated,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

categoryCtrl.deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  try {
    let category = await Category.findOne({ where: { id } });

    if (!category) {
      return responseErrorCode(res, "Esta categoría no existe", 404);
    }

    await Category.destroy({ where: { id } });

    responseSuccessfully(res, "Categoría eliminada", 200, {});
  } catch (error) {
    responseError500(res, error);
  }
};

module.exports = categoryCtrl;
