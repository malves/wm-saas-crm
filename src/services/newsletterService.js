const newsletterRepository = require('../repositories/newsletterRepository');

class NewsletterService {
  getAllNewsletters() {
    return newsletterRepository.findAll();
  }

  getNewsletterById(id) {
    return newsletterRepository.findById(id);
  }

  getActiveNewsletters() {
    return newsletterRepository.findBy({ status: 'active' });
  }

  getNewslettersByStatus(status) {
    return newsletterRepository.findBy({ status });
  }

  createNewsletter(newsletterData) {
    // Validation basique
    if (!newsletterData.name || !newsletterData.description) {
      throw new Error('Le nom et la description sont requis');
    }

    return newsletterRepository.create(newsletterData);
  }

  updateNewsletter(id, newsletterData) {
    const newsletter = newsletterRepository.findById(id);
    if (!newsletter) {
      throw new Error('Newsletter non trouvée');
    }

    return newsletterRepository.update(id, newsletterData);
  }

  deleteNewsletter(id) {
    const newsletter = newsletterRepository.findById(id);
    if (!newsletter) {
      throw new Error('Newsletter non trouvée');
    }

    return newsletterRepository.delete(id);
  }

  // Calculs et statistiques
  getNewsletterStats() {
    const newsletters = this.getAllNewsletters();
    
    if (newsletters.length === 0) {
      return {
        total: 0,
        active: 0,
        draft: 0,
        avgOpenRate: 0,
        totalSubscribers: 0
      };
    }

    return {
      total: newsletters.length,
      active: newsletters.filter(n => n.status === 'active').length,
      draft: newsletters.filter(n => n.status === 'draft').length,
      avgOpenRate: newsletters.reduce((sum, n) => sum + (n.openRate || 0), 0) / newsletters.length,
      totalSubscribers: newsletters.reduce((sum, n) => sum + (n.subscribers || 0), 0)
    };
  }

  incrementSubscriberCount(newsletterId) {
    return newsletterRepository.incrementSubscribers(newsletterId);
  }
}

module.exports = new NewsletterService();

