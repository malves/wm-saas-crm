const subscriberRepository = require('../repositories/subscriberRepository');

class SubscriberService {
  getAllSubscribers() {
    return subscriberRepository.findAll();
  }

  getSubscriberById(id) {
    return subscriberRepository.findById(id);
  }

  getSubscriberByEmail(email) {
    return subscriberRepository.findByEmail(email);
  }

  getActiveSubscribers() {
    return subscriberRepository.findBy({ status: 'active' });
  }

  createSubscriber(subscriberData) {
    // Validation basique
    if (!subscriberData.email || !subscriberData.name) {
      throw new Error('L\'email et le nom sont requis');
    }

    // Vérifier si l'email existe déjà
    if (subscriberRepository.findByEmail(subscriberData.email)) {
      throw new Error('Cet email est déjà enregistré');
    }

    return subscriberRepository.create(subscriberData);
  }

  updateSubscriber(id, subscriberData) {
    const subscriber = subscriberRepository.findById(id);
    if (!subscriber) {
      throw new Error('Abonné non trouvé');
    }

    return subscriberRepository.update(id, subscriberData);
  }

  deleteSubscriber(id) {
    const subscriber = subscriberRepository.findById(id);
    if (!subscriber) {
      throw new Error('Abonné non trouvé');
    }

    return subscriberRepository.delete(id);
  }

  subscribeToNewsletter(subscriberId, newsletterId) {
    return subscriberRepository.subscribeToNewsletter(subscriberId, newsletterId);
  }

  unsubscribeFromNewsletter(subscriberId, newsletterId) {
    return subscriberRepository.unsubscribeFromNewsletter(subscriberId, newsletterId);
  }

  getSubscribersForNewsletter(newsletterId) {
    const allSubscribers = this.getAllSubscribers();
    return allSubscribers.filter(sub => 
      sub.subscribedNewsletters && sub.subscribedNewsletters.includes(newsletterId)
    );
  }

  getSubscriberStats() {
    const subscribers = this.getAllSubscribers();
    
    return {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      inactive: subscribers.filter(s => s.status !== 'active').length
    };
  }
}

module.exports = new SubscriberService();

