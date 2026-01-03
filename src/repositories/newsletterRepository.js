const db = require('../data/jsonDatabaseService');

class NewsletterRepository {
  findAll() {
    return db.getCollection('newsletters');
  }

  findById(id) {
    const newsletters = this.findAll();
    return newsletters.find(n => n.id === parseInt(id));
  }

  findBy(criteria) {
    const newsletters = this.findAll();
    return newsletters.filter(newsletter => {
      return Object.keys(criteria).every(key => 
        newsletter[key] === criteria[key]
      );
    });
  }

  create(newsletterData) {
    const newsletters = db.getCollection('newsletters');
    const newNewsletter = {
      id: db.generateId('newsletters'),
      ...newsletterData,
      subscribers: 0,
      openRate: 0,
      status: newsletterData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    newsletters.push(newNewsletter);
    db.save();
    return newNewsletter;
  }

  update(id, newsletterData) {
    const newsletters = db.getCollection('newsletters');
    const index = newsletters.findIndex(n => n.id === parseInt(id));
    if (index === -1) return null;
    
    newsletters[index] = {
      ...newsletters[index],
      ...newsletterData,
      id: newsletters[index].id,
      createdAt: newsletters[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    db.save();
    return newsletters[index];
  }

  delete(id) {
    const newsletters = db.getCollection('newsletters');
    const index = newsletters.findIndex(n => n.id === parseInt(id));
    if (index === -1) return false;
    
    newsletters.splice(index, 1);
    db.save();
    return true;
  }

  incrementSubscribers(id) {
    const newsletter = this.findById(id);
    if (!newsletter) return null;
    return this.update(id, { subscribers: newsletter.subscribers + 1 });
  }

  updateStats(id, stats) {
    return this.update(id, stats);
  }
}

module.exports = new NewsletterRepository();

