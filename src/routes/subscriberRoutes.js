const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const { requireAuth } = require('../middlewares/auth');
const { validateSubscriber, checkValidation } = require('../middlewares/validation');

// Routes GET
router.get('/', requireAuth, subscriberController.getList);
router.get('/create', requireAuth, subscriberController.getCreateForm);

// Routes POST (CRUD)
router.post('/', requireAuth, validateSubscriber, checkValidation, subscriberController.postCreate);
router.post('/:id/delete', requireAuth, subscriberController.postDelete);

module.exports = router;

