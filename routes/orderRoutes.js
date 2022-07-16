const router = require('express').Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.route('/orders').get(auth, orderController.getOrder).post(auth, orderController.createOrder);
router.route('/get_all_orders').get(auth, orderController.getOrders);
router.route('/orders/:id').patch(auth, authAdmin, orderController.updateOrder);
module.exports = router;
