const express = require('express');
const router = express.Router();

const homeRoutes = require('./homeRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const subscriberRoutes = require('./subscriberRoutes');
const authRoutes = require('./authRoutes');
const activityRoutes = require('./activityRoutes');
const profileRoutes = require('./profileRoutes');
const billingRoutes = require('./billingRoutes');
const settingsRoutes = require('./settingsRoutes');
const templateRoutes = require('./templateRoutes');

router.use('/', homeRoutes);
router.use('/newsletters', newsletterRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/auth', authRoutes);
router.use('/activity', activityRoutes);
router.use('/profile', profileRoutes);
router.use('/billing', billingRoutes);
router.use('/settings', settingsRoutes);
router.use('/templates', templateRoutes);

module.exports = router;

