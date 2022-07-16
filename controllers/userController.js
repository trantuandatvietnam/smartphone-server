// require model
const User = require('../models/UserModel');

// require library
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// controller
const userController = {
    /**
     * [POST]: "/user/register"
     * public
     */
    register: async (req, res) => {
        try {
            const { email, password, number_phone } = req.body;
            // find user by email, if user is exist => register fail
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    message: 'Tài khoản email này đã được đăng ký!, vui lòng đăng nhập hoặc sử dụng email khác',
                });
            }
            // validate password
            let validatePassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if (!validatePassword.test(password)) {
                return res.status(400).json({
                    message: 'Mật khẩu nhập lại không khớp',
                });
            }
            // validate email
            const validateEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!validateEmail.test(email)) {
                return res.status(400).json({
                    message: 'Tài khoản email không hợp lệ',
                });
            }
            // validate number phone
            const validateNumberphone = /((09|03|07|08|05)+([0-9]{8})\b)/g;
            if (!validateNumberphone.test(number_phone)) {
                return res.status(400).json({
                    message: 'Số điện thoại không hợp lệ',
                });
            }
            // hash password
            const passwordHash = await bcrypt.hash(password, 10);
            // create and save a new user to database
            const newUser = new User({
                email,
                password: passwordHash,
                number_phone,
            });
            await newUser.save();
            // then create a jsonwebtoken to authentication
            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshToken', refreshToken, {
                path: 'user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000, //7d
                secure: true,
                sameSite: 'none',
                httpOnly: true,
            });
            res.json({ accessToken });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * [POST]: "/user/login"
     * public
     */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // check login info
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Người dùng không tồn tại' });
            }
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return res.status(400).json({
                    message: 'Tài khoản hoặc mật khâu không chính xác! Vui lòng kiểm tra lại',
                });
            }
            // if login info match a user => login success
            const accessToken = createAccessToken({ id: user._id });
            const refreshToken = createRefreshToken({ id: user._id });
            res.cookie('refreshToken', refreshToken, {
                path: 'user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000, //7d
                secure: true,
                sameSite: 'none',
                httpOnly: true,
            });
            res.json({ accessToken });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * [GET]: "/user/logout"
     * public
     */
    logout: (req, res) => {
        res.clearCookie('refreshToken', {
            path: '/user/refresh_token',
        });
        return res.json({ message: 'Đăng xuất thành công' });
    },
    /**
     * [GET]: "/user/info_user"
     * private (only user logged)
     */
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                res.status(400).json({ message: 'Người dùng không tồn tại!' });
            }
            return res.json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    /**
     * [GET]: "/user/refresh_token"
     * public
     */
    refreshToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) {
                return res.status(400).json({
                    message: 'Vui lòng đăng kí tài khoan hoặc đăng nhập',
                });
            }
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(400).json({
                        message: 'Vui lòng đăng kí tài khoan hoặc đăng nhập',
                    });
                }
                const accessToken = createAccessToken({ id: user.id });
                res.json({ accessToken });
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * [PATCH]: "/user/cart"
     * private(user must be logged in)
     */
    addToCart: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(400).json({ message: 'Người dùng này không tồn tại!' });
            }
            await User.findOneAndUpdate({ _id: req.user.id }, { cart: req.body.cart });
            return res.json({ message: 'Sản phẩm đã được thêm vào giỏ hàng!' });
        } catch (error) {
            return res.json({ message: error.message });
        }
    },
    /**
     * [PATCH]: "/user/cart/update"
     * private(user must be logged in)
     */
    updateCartProduct: async (req, res) => {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'Người dùng này không tồn tại!' });
        }
        const cart = user.cart;
        const productCartUpdate = req.body.productCartUpdate;
        const indexProductUpdate = cart.findIndex(
            (item) => item.product.productName === productCartUpdate.product.productName
        );
        if (indexProductUpdate === -1) {
            return res.status(400).json({ message: 'Không tìm thấy sản phẩm!' });
        }
        cart[indexProductUpdate] = productCartUpdate;
        await User.findOneAndUpdate({ _id: req.user.id }, { cart: cart });
        return res.json({ message: 'Cập nhật giỏ hàng thành công!' });
    },
    /**
     * [PATCH]: "/user/cart/delete"
     * private(user must be logged in)
     */
    deleteOneCartProduct: async (req, res) => {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'Người dùng này không tồn tại!' });
        }
        const cart = user.cart;
        const productCartDelete = req.body.productCartDelete;
        const indexProductDelete = cart.findIndex(
            (item) => item.product.productName === productCartDelete.product.productName
        );
        if (indexProductDelete === -1) {
            return res.status(400).json({ message: 'Không tìm thấy sản phẩm!' });
        }
        cart.splice(indexProductDelete, 1);
        await User.findOneAndUpdate({ _id: req.user.id }, { cart: cart });
        return res.json({ message: 'Cập nhật giỏ hàng thành công!' });
    },
    /**
     * [PATCH]: "/user/update"
     * private(user must be logged in)
     * only
     */
    updateUserInfo: async (req, res) => {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản không hợp lệ' });
        }
        const fieldsUpdate = req.body.fieldsUpdate;
        // validate number phone
        const validateNumberphone = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (fieldsUpdate?.number_phone && !validateNumberphone.test(fieldsUpdate?.number_phone)) {
            return res.status(400).json({
                message: 'Số điện thoại không hợp lệ',
            });
        }
        // validate name
        if (fieldsUpdate?.name && (fieldsUpdate?.name.length < 2 || fieldsUpdate?.name.length > 16)) {
            return res.status(400).json({
                message: 'Tên của bạn cần ít nhất 2 kí tự và nhiều nhất 16 kí tự',
            });
        }
        await User.findOneAndUpdate({ _id: id }, { ...fieldsUpdate });
        return res.json({ message: 'Cập nhật thông tin thành công' });
    },
    /**
     * [PATCH]: "/user/order"
     * private(user must be logged in)
     * only
     */
    updateOrder: async (req, res) => {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản không hợp lệ' });
        }
    },
    /**
     * [PATCH]: "/user/history"
     * private(user must be logged in)
     * only
     */
    updateHistory: async (req, res) => {
        const { id } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản không hợp lệ' });
        }
    },
};

// create token function
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '11m',
    });
};

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = userController;
