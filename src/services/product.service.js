import product from "../models/Product.js";
import uploadFile from "../utils/fileUploader.js";

const getAllProducts = async (query) => {
  const sort = query.sort ? JSON.parse(query.sort) : {};
  const limit = Number(query.limit ?? 10);
  const offset = Number(query.offset ?? 0);

  const filters = {};
 
  const { category, brands, name, min, max, createdBy } = query;

  if (category) filters.category = category.trim();
  if (brands) {
    filters.brand = {
      $in: brands
        .split(",")
        .map((brand) => brand.trim())
        .filter(Boolean),
    };
  }
  if (name) filters.name = { $regex: name, $options: "i" };
  if (min) filters.price = { $gte: min };
  if (max) filters.price = { ...filters.price, $lte: max };
  if (createdBy) filters.createdBy = createdBy;

  const products = await product
    .find(filters)
    .sort(sort)
    .limit(limit)
    .skip(offset);

  return products;
};

const getProductById = async (id) => {
  const foundProduct = await product.findById(id);

  return foundProduct;
};

const createProduct = async (data, files, userId) => {
  const uploadedFiles = await uploadFile(files);

  return await product.create({
    ...data,
    imageUrls: uploadedFiles.map((file) => file.url),
    createdBy: userId,
  });
};
const updateProduct = async (id, input, files) => {
  const updateData = input;

  if (files && files.length > 0) {
    const uploadedFilles = await uploadFile(files);
    updateData.imageUrls = uploadedFilles.map((file) => file.url);
  }
  return await product.findByIdAndUpdate(id, updateData, { new: true });
};


const deleteProduct = async (id) => {
  return await product.findByIdAndDelete(id);
};
const getBrands = async () => {
  return await product.distinct("brand");
};
const getCategories = async () => {
  return await product.distinct("category");
};
const getTotalCount = async () => {
  return await product.countDocuments();
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getCategories,
  getTotalCount,
};
