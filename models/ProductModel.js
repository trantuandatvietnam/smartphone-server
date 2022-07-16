const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        category: { type: String, required: true, trim: true },
        productDescription: { type: Object, default: null },
        thumbnail: { type: Object, required: true },
        images: { type: Array, default: [] },
        quantity: { type: Number, required: true },
        sold: { type: Number, default: 0 },
        sale: { type: Number, default: 0 },
        brand: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', ProductSchema);
