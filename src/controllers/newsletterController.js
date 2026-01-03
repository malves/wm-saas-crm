const newsletterService = require('../services/newsletterService');

exports.getList = (req, res) => {
  try {
    res.locals.activeMenu = 'newsletters';
    const newsletters = newsletterService.getAllNewsletters();
    res.render('pages/newsletters/list', {
      title: 'Newsletters',
      newsletters,
      activeMenu: 'newsletters'
    });
  } catch (error) {
    console.error('Error in getList:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getDetails = (req, res) => {
  try {
    res.locals.activeMenu = 'newsletters';
    const newsletter = newsletterService.getNewsletterById(req.params.id);
    if (!newsletter) {
      return res.status(404).render('pages/404', {
        title: 'Newsletter non trouvée',
        activeMenu: 'newsletters'
      });
    }
    res.render('pages/newsletters/details', {
      title: newsletter.name,
      newsletter,
      activeMenu: 'newsletters'
    });
  } catch (error) {
    console.error('Error in getDetails:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getCreateForm = (req, res) => {
  res.locals.activeMenu = 'newsletters';
  res.render('pages/newsletters/create', {
    title: 'Créer une newsletter',
    activeMenu: 'newsletters',
    errors: req.session.errors || [],
    formData: req.session.formData || {}
  });
  delete req.session.errors;
  delete req.session.formData;
};

exports.postCreate = (req, res) => {
  try {
    const newsletterData = {
      ...req.body,
      createdBy: req.session.user.id
    };
    const newsletter = newsletterService.createNewsletter(newsletterData);
    res.redirect(`/newsletters/${newsletter.id}`);
  } catch (error) {
    req.session.errors = [{ msg: error.message }];
    req.session.formData = req.body;
    res.redirect('/newsletters/create');
  }
};

exports.getEditForm = (req, res) => {
  try {
    res.locals.activeMenu = 'newsletters';
    const newsletter = newsletterService.getNewsletterById(req.params.id);
    if (!newsletter) {
      return res.status(404).render('pages/404', {
        title: 'Newsletter non trouvée',
        activeMenu: 'newsletters'
      });
    }
    res.render('pages/newsletters/edit', {
      title: 'Modifier la newsletter',
      newsletter,
      activeMenu: 'newsletters',
      errors: req.session.errors || []
    });
    delete req.session.errors;
  } catch (error) {
    console.error('Error in getEditForm:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.postUpdate = (req, res) => {
  try {
    const newsletter = newsletterService.updateNewsletter(req.params.id, req.body);
    res.redirect(`/newsletters/${newsletter.id}`);
  } catch (error) {
    req.session.errors = [{ msg: error.message }];
    res.redirect(`/newsletters/${req.params.id}/edit`);
  }
};

exports.postDelete = (req, res) => {
  try {
    newsletterService.deleteNewsletter(req.params.id);
    res.redirect('/newsletters');
  } catch (error) {
    console.error('Error in postDelete:', error);
    res.status(500).send('Erreur lors de la suppression');
  }
};

