// require
const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// using router with methods
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', auth, userController.logout);
router.get('/refresh_token', userController.refreshToken);
router.patch('/update', auth, userController.updateUserInfo);

router.patch('/cart', auth, userController.addToCart);
router.patch('/cart/update', auth, userController.updateCartProduct);
router.patch('/cart/delete', auth, userController.deleteOneCartProduct);

router.get('/info_user', auth, userController.getUser);

// export
module.exports = router;
