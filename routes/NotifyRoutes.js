const notifyController = require('../controllers/NotifyController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

const router = require('express').Router();

router.route('/notify').get(notifyController.getNotify).post(auth, authAdmin, notifyController.createNotify);

router
    .route('/notify/:id')
    .patch(auth, authAdmin, notifyController.updateNotify)
    .delete(auth, authAdmin, notifyController.deleteNotify);

module.exports = router;
