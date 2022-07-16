const mongoose = require('mongoose');

const Category = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        pathname: { type: String, required: true, trim: true, unique: true },
        icon: { type: String, required: true, trim: true },
        brand: { type: Array, default: [] },
        img: { type: Object, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Category', Category);
