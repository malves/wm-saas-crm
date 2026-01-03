const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { requireAuth } = require('../middlewares/auth');
const { validateNewsletter, checkValidation } = require('../middlewares/validation');

// Routes GET
router.get('/', requireAuth, newsletterController.getList);
router.get('/create', requireAuth, newsletterController.getCreateForm);
router.get('/:id', requireAuth, newsletterController.getDetails);
router.get('/:id/edit', requireAuth, newsletterController.getEditForm);

// Routes POST (CRUD)
router.post('/', requireAuth, validateNewsletter, checkValidation, newsletterController.postCreate);
router.post('/:id/edit', requireAuth, validateNewsletter, checkValidation, newsletterController.postUpdate);
router.post('/:id/delete', requireAuth, newsletterController.postDelete);

module.exports = router;

