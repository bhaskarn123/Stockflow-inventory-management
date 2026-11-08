const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        sku: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        description: {
            type: String,
            default: ""
        },

        quantityOnHand: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            validate: Number.isInteger
        },

        costPrice: {
            type: Number,
            min: 0
        },

        sellingPrice: {
            type: Number,
            min: 0
        },

        lowStockThreshold: {
            type: Number,
            min: 0,
            validate: Number.isInteger
        }
    },
    {
        timestamps: true
    }
);

// SKU must be unique within each organization
productSchema.index(
    { organization: 1, sku: 1 },
    { unique: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;