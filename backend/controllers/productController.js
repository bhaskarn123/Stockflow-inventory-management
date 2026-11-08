
const Product = require("../models/Product");

// 1. CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            description,
            quantityOnHand,
            costPrice,
            sellingPrice,
            lowStockThreshold
        } = req.body;

        if (!name || !sku || quantityOnHand === undefined) {
            return res.status(400).json({
                message: "Name, SKU and quantity are required"
            });
        }

        const product = await Product.create({
            organization: req.user.organizationId,
            name,
            sku,
            description,
            quantityOnHand,
            costPrice,
            sellingPrice,
            lowStockThreshold
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This SKU already exists in your organization"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};


// 2. GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const filter = {
            organization: req.user.organizationId
        };

        // Optional search by name or SKU
        if (req.query.search) {
            const search = req.query.search;

            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } }
            ];
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// 3. UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
       const allowedFields = [
    "name",
    "sku",
    "description",
    "quantityOnHand",
    "costPrice",
    "sellingPrice",
    "lowStockThreshold"
];

const updates = {};

allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
    }
});

const product = await Product.findOneAndUpdate(
    {
        _id: req.params.id,
        organization: req.user.organizationId
    },
    updates,
    {
        new: true,
        runValidators: true
    }
);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This SKU already exists in your organization"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};


// 4. DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            organization: req.user.organizationId
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
};
