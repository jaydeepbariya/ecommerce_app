const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");

exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.log("GET ALL CATEGORIES ERROR ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    console.log("GET CATEGORY BY ID ERROR ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new CategoryModel({ name, description, products: [] });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    let category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (req.body.name) {
      category.name = req.body.name;
    }
    if (req.body.description) {
      category.description = req.body.description;
    }

    category = await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log("UPDATE CATEGORY ERROR ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const products = await ProductModel.find({ categoryId });

    await ProductModel.deleteMany({ categoryId });

    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category and associated products deleted successfully",
    });
  } catch (error) {
    console.log("DELETE CATEGORY ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
