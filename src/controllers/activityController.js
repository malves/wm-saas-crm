const newsletterService = require('../services/newsletterService');

exports.getMain = (req, res) => {
  try {
    res.locals.activeMenu = 'activity';
    const newsletters = newsletterService.getAllNewsletters();
    const stats = newsletterService.getNewsletterStats();
    
    res.render('pages/activity/main', {
      title: 'Journal d\'activité',
      newsletters,
      stats,
      activeMenu: 'activity'
    });
  } catch (error) {
    console.error('Error in getMain:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getCollection = (req, res) => {
  try {
    res.locals.activeMenu = 'activity';
    const newsletters = newsletterService.getAllNewsletters();
    
    res.render('pages/activity/collection', {
      title: 'Collection',
      newsletters,
      activeMenu: 'activity'
    });
  } catch (error) {
    console.error('Error in getCollection:', error);
    res.status(500).send('Erreur serveur');
  }
};

