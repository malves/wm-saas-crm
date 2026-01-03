const newsletterService = require('../services/newsletterService');

exports.getHome = async (req, res) => {
  try {
    res.locals.activeMenu = 'dashboard';
    const newsletters = newsletterService.getActiveNewsletters();
    const stats = newsletterService.getNewsletterStats();
    
    res.render('pages/home', {
      title: 'Dashboard',
      newsletters,
      stats,
      activeMenu: 'dashboard'
    });
  } catch (error) {
    console.error('Error in homeController:', error);
    res.status(500).send('Erreur serveur');
  }
};

