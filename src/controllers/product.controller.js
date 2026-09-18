import productService from "../services/product.service.js";



const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query);

        return res.json(products);

    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message
        });
    }
};


const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(
            req.params.id
        );

        return res.json(product);

    } catch (error) {
        return res.status(error.status || 404).json({
            message: error.message
        });
    }
};


const createProduct = async (req, res) => {
    const userId = req.user._id;

    const files=  req.files;
    

    try {
        const product = await productService.createProduct(req.body,req.files, userId);
        res.json(product);

    } catch (error) {
        return res.status(error.status || 400).json({
            message: error.message
        });
    }
};


const updateProduct = async (req, res) => {
    const id = req.params.id;
    const input = req.body;

    try {
        const product = await productService.updateProduct(
            id,
            input,
            req.files
        );

        return res.json(product);

    } catch (error) {
        return res.status(error.status || 404).json({
            message: error.message
        });
    }
};


const deleteProduct = async (req, res) => {
    const id = req.params.id;

    try {
        await productService.deleteProduct(id);

        return res.json({
            message: "Product deleted successfully."
        });

    } catch (error) {
        return res.status(error.status || 404).json({
            message: error.message
        });
    }
};

const getBrands = async (req, res) => {
    
        const brands = await productService.getBrands();

        return res.json(brands);

    
};
const getCategories = async (req, res) => {
    
        const categories = await productService.getCategories();

        return res.json(categories);

    
};
const getTotalCount = async (req, res) => {
    
        const count = await productService.getTotalCount();

        return res.json(count);

    
};


export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getBrands,
    getCategories,
    getTotalCount
};

