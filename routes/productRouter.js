const ProductController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

const router = require('express').Router();

router
    .route('/products/:id')
    .get(ProductController.getProductById)
    .patch(auth, authAdmin, ProductController.updateProduct)
    .delete(auth, authAdmin, ProductController.deleteProduct);
router.route('/products').get(ProductController.getProducts).post(auth, authAdmin, ProductController.createProduct);

module.exports = router;
