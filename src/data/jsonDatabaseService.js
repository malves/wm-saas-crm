const fs = require('fs');
const path = require('path');

class JsonDatabaseService {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.data = {};
  }

  initialize() {
    try {
      if (!fs.existsSync(this.dbPath)) {
        // Créer la structure par défaut si le fichier n'existe pas
        this.data = {
          users: [],
          newsletters: [],
          subscribers: [],
          activities: []
        };
        this.save();
        console.log('✓ Base de données créée avec succès');
      } else {
        const content = fs.readFileSync(this.dbPath, 'utf-8');
        this.data = JSON.parse(content);
        console.log('✓ Base de données chargée avec succès');
      }
    } catch (error) {
      console.error('Erreur initialisation DB:', error.message);
      throw error;
    }
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  // Générer un ID unique pour une collection
  generateId(collection) {
    const items = this.getCollection(collection);
    if (items.length === 0) return 1;
    const maxId = Math.max(...items.map(item => item.id || 0));
    return maxId + 1;
  }

  // Écriture atomique pour éviter la corruption de données
  save() {
    const tempPath = this.dbPath + '.tmp';
    
    try {
      // 1. Écrire dans un fichier temporaire
      const jsonContent = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(tempPath, jsonContent, 'utf-8');
      
      // 2. Renommer atomiquement (opération système instantanée)
      fs.renameSync(tempPath, this.dbPath);
      
      return true;
    } catch (error) {
      // 3. Nettoyer le fichier temporaire en cas d'erreur
      try {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      } catch {}
      
      console.error('Erreur sauvegarde:', error.message);
      throw error;
    }
  }
}

module.exports = new JsonDatabaseService(path.join(__dirname, 'db.json'));

