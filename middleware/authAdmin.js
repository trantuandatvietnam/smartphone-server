const User = require('../models/UserModel');

const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản không hợp lệ' });
        }
        if (user.role === 0) {
            return res.status(400).json({ message: 'Bạn không phải là admin!' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = authAdmin;
