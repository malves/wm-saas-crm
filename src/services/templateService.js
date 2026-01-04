const templateRepository = require('../repositories/templateRepository');
const fs = require('fs').promises;
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../../templates');

class TemplateService {
  constructor() {
    this.ensureTemplatesDir();
  }

  async ensureTemplatesDir() {
    try {
      await fs.access(TEMPLATES_DIR);
    } catch {
      await fs.mkdir(TEMPLATES_DIR, { recursive: true });
    }
  }

  /**
   * Lister tous les templates d'un utilisateur
   * Metadata depuis db.json (rapide)
   */
  getUserTemplates(userId) {
    return templateRepository.findByUserId(userId);
  }

  /**
   * Lister tous les templates
   */
  getAllTemplates() {
    return templateRepository.findAll();
  }

  /**
   * Charger un template complet (metadata + blocks)
   * Metadata depuis db.json + Blocks depuis filesystem
   */
  async getTemplateWithBlocks(id) {
    // 1. Charger metadata depuis DB
    const template = templateRepository.findById(id);
    if (!template) {
      throw new Error('Template non trouvé');
    }

    // 2. Charger blocks depuis filesystem
    if (template.filePath) {
      const configPath = path.join(TEMPLATES_DIR, template.filePath);
      try {
        const content = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(content);
        
        return {
          ...template,
          blocks: config.blocks
        };
      } catch (error) {
        console.error('Erreur lors du chargement des blocks:', error);
        // Fallback : retourner sans blocks si le fichier n'existe pas
        return {
          ...template,
          blocks: []
        };
      }
    }

    return {
      ...template,
      blocks: []
    };
  }

  /**
   * Sauvegarder un template
   * Metadata dans db.json + Contenu dans filesystem
   */
  async saveTemplate(templateData) {
    const { id, name, description, blocks, html, userId } = templateData;
    
    // Assurer que le répertoire templates existe
    await this.ensureTemplatesDir();

    // 1. Créer/mettre à jour dans DB
    let template;
    if (id) {
      // Mise à jour
      const existing = templateRepository.findById(id);
      if (!existing) {
        throw new Error('Template non trouvé');
      }
      
      template = templateRepository.update(id, {
        name,
        description,
        filePath: `template-${id}/config.json`,
        thumbnail: `/templates/template-${id}/thumbnail.png`
      });
    } else {
      // Création
      template = templateRepository.create({
        name,
        description,
        userId,
        filePath: '', // sera mis à jour après
        thumbnail: ''
      });
      
      // Mettre à jour le filePath avec le vrai ID
      template = templateRepository.update(template.id, {
        filePath: `template-${template.id}/config.json`,
        thumbnail: `/templates/template-${template.id}/thumbnail.png`
      });
    }

    // 2. Sauvegarder les blocks dans filesystem
    const templateDir = path.join(TEMPLATES_DIR, `template-${template.id}`);
    await fs.mkdir(templateDir, { recursive: true });

    const configPath = path.join(templateDir, 'config.json');
    const config = {
      blocks: typeof blocks === 'string' ? JSON.parse(blocks) : blocks
    };
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

    // 3. Sauvegarder le HTML
    if (html) {
      const htmlPath = path.join(templateDir, 'email.html');
      await fs.writeFile(htmlPath, html, 'utf8');
    }

    return template;
  }

  /**
   * Supprimer un template
   * Supprimer de db.json + Supprimer du filesystem
   */
  async deleteTemplate(id) {
    const template = templateRepository.findById(id);
    if (!template) {
      throw new Error('Template non trouvé');
    }

    // 1. Supprimer de la DB
    templateRepository.delete(id);

    // 2. Supprimer du filesystem
    const templateDir = path.join(TEMPLATES_DIR, `template-${id}`);
    try {
      await fs.rm(templateDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Erreur lors de la suppression du répertoire:', error);
    }

    return true;
  }

  /**
   * Dupliquer un template
   */
  async duplicateTemplate(id, userId) {
    // Charger l'original avec blocks
    const original = await this.getTemplateWithBlocks(id);
    
    // Charger le HTML si disponible
    let html = '';
    try {
      const htmlPath = path.join(TEMPLATES_DIR, `template-${id}`, 'email.html');
      html = await fs.readFile(htmlPath, 'utf8');
    } catch (error) {
      console.log('Pas de HTML à dupliquer');
    }

    // Créer la copie
    return await this.saveTemplate({
      name: `${original.name} (copie)`,
      description: original.description,
      blocks: original.blocks,
      html,
      userId
    });
  }

  /**
   * Récupérer le HTML d'un template
   */
  async getTemplateHTML(id) {
    const template = templateRepository.findById(id);
    if (!template) {
      throw new Error('Template non trouvé');
    }

    const htmlPath = path.join(TEMPLATES_DIR, `template-${id}`, 'email.html');
    try {
      return await fs.readFile(htmlPath, 'utf8');
    } catch (error) {
      throw new Error(`HTML du template ${id} non trouvé`);
    }
  }

  /**
   * Obtenir un template par ID (metadata uniquement)
   */
  getTemplateById(id) {
    return templateRepository.findById(id);
  }
}

module.exports = new TemplateService();
