const subscriberService = require('../services/subscriberService');
const newsletterService = require('../services/newsletterService');

exports.getList = (req, res) => {
  try {
    res.locals.activeMenu = 'subscribers';
    const subscribers = subscriberService.getAllSubscribers();
    const stats = subscriberService.getSubscriberStats();
    
    res.render('pages/subscribers/list', {
      title: 'Abonnés',
      subscribers,
      stats,
      activeMenu: 'subscribers'
    });
  } catch (error) {
    console.error('Error in getList:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getCreateForm = (req, res) => {
  try {
    res.locals.activeMenu = 'subscribers';
    const newsletters = newsletterService.getAllNewsletters();
    res.render('pages/subscribers/create', {
      title: 'Ajouter un abonné',
      newsletters,
      activeMenu: 'subscribers',
      errors: req.session.errors || [],
      formData: req.session.formData || {}
    });
    delete req.session.errors;
    delete req.session.formData;
  } catch (error) {
    console.error('Error in getCreateForm:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.postCreate = (req, res) => {
  try {
    const subscriberData = {
      ...req.body,
      subscribedNewsletters: req.body.newsletters ? 
        (Array.isArray(req.body.newsletters) ? req.body.newsletters.map(id => parseInt(id)) : [parseInt(req.body.newsletters)]) : 
        []
    };
    const subscriber = subscriberService.createSubscriber(subscriberData);
    res.redirect('/subscribers');
  } catch (error) {
    req.session.errors = [{ msg: error.message }];
    req.session.formData = req.body;
    res.redirect('/subscribers/create');
  }
};

exports.postDelete = (req, res) => {
  try {
    subscriberService.deleteSubscriber(req.params.id);
    res.redirect('/subscribers');
  } catch (error) {
    console.error('Error in postDelete:', error);
    res.status(500).send('Erreur lors de la suppression');
  }
};

