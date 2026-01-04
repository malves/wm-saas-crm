const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { requireAuth } = require('../middlewares/auth');

// Liste des templates
router.get('/', requireAuth, templateController.getList);

// Builder (création)
router.get('/create', requireAuth, templateController.getBuilder);

// Builder (édition)
router.get('/:id/edit', requireAuth, templateController.getBuilder);

// Sauvegarder
router.post('/save', requireAuth, templateController.postSave);

// Actions
router.post('/:id/duplicate', requireAuth, templateController.postDuplicate);
router.post('/:id/delete', requireAuth, templateController.postDelete);

// Récupérer le HTML
router.get('/:id/html', requireAuth, templateController.getHTML);

module.exports = router;
