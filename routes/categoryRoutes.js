const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router
    .route('/category/:id')
    .delete(auth, authAdmin, categoryController.deleteCategory)
    .patch(auth, authAdmin, categoryController.updateCategory);

router
    .route('/category')
    .get(categoryController.getCategories)
    .post(auth, authAdmin, categoryController.createCategory);

module.exports = router;
