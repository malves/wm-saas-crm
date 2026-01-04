const db = require('../data/jsonDatabaseService');

class TemplateRepository {
  findAll() {
    return db.getCollection('templates');
  }

  findById(id) {
    const templates = this.findAll();
    return templates.find(t => t.id === parseInt(id));
  }

  findByUserId(userId) {
    const templates = this.findAll();
    return templates.filter(t => t.userId === parseInt(userId));
  }

  findBy(criteria) {
    const templates = this.findAll();
    return templates.filter(template => {
      return Object.keys(criteria).every(key =>
        template[key] === criteria[key]
      );
    });
  }

  create(templateData) {
    const templates = db.getCollection('templates');
    const newTemplate = {
      id: db.generateId('templates'),
      ...templateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    templates.push(newTemplate);
    db.save();
    return newTemplate;
  }

  update(id, templateData) {
    const templates = db.getCollection('templates');
    const index = templates.findIndex(t => t.id === parseInt(id));
    if (index === -1) return null;

    templates[index] = {
      ...templates[index],
      ...templateData,
      id: templates[index].id,
      createdAt: templates[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    db.save();
    return templates[index];
  }

  delete(id) {
    const templates = db.getCollection('templates');
    const index = templates.findIndex(t => t.id === parseInt(id));
    if (index === -1) return false;

    templates.splice(index, 1);
    db.save();
    return true;
  }
}

module.exports = new TemplateRepository();
