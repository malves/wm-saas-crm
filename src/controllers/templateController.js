const templateService = require('../services/templateService');

exports.getList = async (req, res) => {
  try {
    res.locals.activeMenu = 'templates';
    const userId = req.session.user.id;
    
    // Liste depuis db.json (rapide, avec métadonnées)
    const templates = templateService.getUserTemplates(userId);
    
    res.render('pages/templates/list', {
      title: 'Templates',
      templates,
      activeMenu: 'templates'
    });
  } catch (error) {
    console.error('Error in getList:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getBuilder = async (req, res) => {
  try {
    res.locals.activeMenu = 'templates';
    
    let template = null;
    
    if (req.params.id) {
      // Charger metadata + blocks
      template = await templateService.getTemplateWithBlocks(req.params.id);
      
      // Vérifier que le template appartient à l'utilisateur
      if (template.userId !== req.session.user.id) {
        return res.status(403).send('Accès non autorisé');
      }
    }
    
    res.render('pages/templates/builder', {
      title: template ? `Éditer ${template.name}` : 'Nouveau template',
      template: template || { name: 'Nouveau template', description: '', blocks: [] },
      activeMenu: 'templates',
      layout: false // Pas de layout pour le builder (plein écran)
    });
  } catch (error) {
    console.error('Error in getBuilder:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.postSave = async (req, res) => {
  try {
    const { id, name, description, blocks, html } = req.body;
    const userId = req.session.user.id;
    
    // Valider que si c'est une mise à jour, l'utilisateur est propriétaire
    if (id) {
      const existing = templateService.getTemplateById(id);
      if (!existing || existing.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Accès non autorisé' 
        });
      }
    }
    
    const templateData = {
      id: id || null,
      name,
      description: description || '',
      blocks,
      html,
      userId
    };
    
    const savedTemplate = await templateService.saveTemplate(templateData);
    
    res.json({ 
      success: true, 
      templateId: savedTemplate.id 
    });
  } catch (error) {
    console.error('Error in postSave:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.postDuplicate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Vérifier que le template existe et appartient à l'utilisateur
    const original = templateService.getTemplateById(id);
    if (!original || original.userId !== userId) {
      return res.status(403).send('Accès non autorisé');
    }
    
    const duplicate = await templateService.duplicateTemplate(id, userId);
    
    res.redirect('/templates');
  } catch (error) {
    console.error('Error in postDuplicate:', error);
    res.status(500).send('Erreur lors de la duplication');
  }
};

exports.postDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Vérifier que le template existe et appartient à l'utilisateur
    const template = templateService.getTemplateById(id);
    if (!template || template.userId !== userId) {
      return res.status(403).send('Accès non autorisé');
    }
    
    await templateService.deleteTemplate(id);
    res.redirect('/templates');
  } catch (error) {
    console.error('Error in postDelete:', error);
    res.status(500).send('Erreur lors de la suppression');
  }
};

exports.getHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Vérifier que le template existe et appartient à l'utilisateur
    const template = templateService.getTemplateById(id);
    if (!template || template.userId !== userId) {
      return res.status(403).send('Accès non autorisé');
    }
    
    const html = await templateService.getTemplateHTML(id);
    res.type('html').send(html);
  } catch (error) {
    res.status(404).send('Template non trouvé');
  }
};
