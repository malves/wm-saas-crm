const db = require('../data/jsonDatabaseService');

class SubscriberRepository {
  findAll() {
    return db.getCollection('subscribers');
  }

  findById(id) {
    const subscribers = this.findAll();
    return subscribers.find(s => s.id === parseInt(id));
  }

  findByEmail(email) {
    const subscribers = this.findAll();
    return subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  findBy(criteria) {
    const subscribers = this.findAll();
    return subscribers.filter(subscriber => {
      return Object.keys(criteria).every(key => 
        subscriber[key] === criteria[key]
      );
    });
  }

  create(subscriberData) {
    const subscribers = db.getCollection('subscribers');
    const newSubscriber = {
      id: db.generateId('subscribers'),
      ...subscriberData,
      subscribedNewsletters: subscriberData.subscribedNewsletters || [],
      status: subscriberData.status || 'active',
      createdAt: new Date().toISOString()
    };
    subscribers.push(newSubscriber);
    db.save();
    return newSubscriber;
  }

  update(id, subscriberData) {
    const subscribers = db.getCollection('subscribers');
    const index = subscribers.findIndex(s => s.id === parseInt(id));
    if (index === -1) return null;
    
    subscribers[index] = {
      ...subscribers[index],
      ...subscriberData,
      id: subscribers[index].id,
      createdAt: subscribers[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    db.save();
    return subscribers[index];
  }

  delete(id) {
    const subscribers = db.getCollection('subscribers');
    const index = subscribers.findIndex(s => s.id === parseInt(id));
    if (index === -1) return false;
    
    subscribers.splice(index, 1);
    db.save();
    return true;
  }

  subscribeToNewsletter(subscriberId, newsletterId) {
    const subscriber = this.findById(subscriberId);
    if (!subscriber) return null;
    
    const newsletters = subscriber.subscribedNewsletters || [];
    if (!newsletters.includes(newsletterId)) {
      newsletters.push(newsletterId);
      return this.update(subscriberId, { subscribedNewsletters: newsletters });
    }
    return subscriber;
  }

  unsubscribeFromNewsletter(subscriberId, newsletterId) {
    const subscriber = this.findById(subscriberId);
    if (!subscriber) return null;
    
    const newsletters = (subscriber.subscribedNewsletters || []).filter(id => id !== newsletterId);
    return this.update(subscriberId, { subscribedNewsletters: newsletters });
  }
}

module.exports = new SubscriberRepository();

