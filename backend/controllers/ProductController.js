const ProductModel = require("../models/ProductModel");

exports.getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    res
      .status(200)
      .json({ success: true, message: "Fetched All Products", products });
  } catch (error) {
    console.log("GET ALL PRODUCTS ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("GET PRODUCT BY ID ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, stock } = req.body;

    if (!name || !description || !price || !categoryId || !stock) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const existingProduct = await ProductModel.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(
      req.files.image.path
    );

    const product = new ProductModel({
      name,
      description,
      price,
      category: categoryId,
      stock,
      image: secure_url,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    let product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (req.body.name) {
      product.name = req.body.name;
    }

    if (req.body.description) {
      product.description = req.body.description;
    }

    if (req.body.price) {
      product.price = req.body.price;
    }

    if (req.body.categoryId) {
      product.categoryId = req.body.categoryId;
    }

    if (req.body.stock) {
      product.stock = req.body.stock;
    }

    product = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const products = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("SEARCH PRODUCTS ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
