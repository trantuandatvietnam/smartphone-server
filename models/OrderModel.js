const mongoose = require('mongoose');

const OrderModel = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        account: {
            type: String,
            required: true,
        },
        productOrder: {
            type: Object,
            default: null,
            required: true,
        },
        status: {
            type: String,
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', OrderModel);
