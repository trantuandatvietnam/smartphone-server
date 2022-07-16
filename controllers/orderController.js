const Order = require('../models/OrderModel');
const User = require('../models/UserModel');

const orderController = {
    /**
     * api/orders
     * [GET], private
     * only authenticate
     */
    getOrder: async (req, res) => {
        try {
            const { id } = req.user;
            const user = await User.findById(id);

            if (!user) {
                return res.status(400).json({ message: 'Bạn chưa đăng nhập!' });
            }
            const orders = await Order.find({ user_id: id }).sort('-createdAt');
            return res.json({ orders });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * api/orders
     * [GET], private
     * only authenticate
     */
    getOrders: async (req, res) => {
        try {
            const orders = await Order.find().sort('-createdAt');
            return res.json({ orders });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * api/orders
     * [POST], private
     * only authenticate
     */
    createOrder: async (req, res) => {
        try {
            const { id } = req.user;
            const user = await User.findById(id);

            if (!user) {
                return res.status(400).json({ message: 'Bạn chưa đăng nhập!' });
            }

            const { productOrder } = req.body;
            const newOrder = new Order({
                user_id: id,
                account: user.email,
                productOrder,
            });

            await newOrder.save();

            return res.json({ message: 'Thành công!' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * api/orders
     * [PATCH], private
     * only authenticate
     */
    updateOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const fieldUpdate = req.body;
            const orders = await Order.findByIdAndUpdate(id, { ...fieldUpdate });
            return res.json({ orders });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};

module.exports = orderController;
