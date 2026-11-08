const Product = require("../models/Product");

const getDashboard = async (req, res) => {
    try {
        const products = await Product.find({
            organization: req.user.organizationId
        });

        const totalProducts = products.length;

        const totalQuantity = products.reduce(
            (sum, product) => sum + product.quantityOnHand,
            0
        );

        const lowStockItems = products.filter((product) => {
            const threshold = product.lowStockThreshold ?? 5;

            return product.quantityOnHand <= threshold;
        });

        res.status(200).json({
            totalProducts,
            totalQuantity,
            lowStockCount: lowStockItems.length,
            lowStockItems
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { getDashboard };