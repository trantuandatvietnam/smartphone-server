// require
const mongoose = require('mongoose');

// Model
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: '',
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        number_phone: {
            type: String,
            trim: true,
            required: true,
        },
        // [{province, district, wards, address_details}]
        address: {
            type: Array,
            default: [],
        },
        password: {
            type: String,
            required: true,
        },
        // role = 1 => admin, role = 0 => user
        role: {
            type: Number,
            default: 0,
        },
        cart: {
            type: Array,
            default: [],
        },
        propose: {
            type: Array,
            default: [],
        },
        history: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);
