const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { createSchema } = require('./models/schema');

const dbPath = path.resolve(process.env.DATABASE_FILE || path.join(__dirname, '..', 'data', 'berwa_hms.db'));

function initDatabase() {
  const dataFolder = path.dirname(dbPath);
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }
  const db = new Database(dbPath);
  createSchema(db);
  db.close();
}

function connect() {
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  return db;
}

module.exports = {
  initDatabase,
  connect,
  dbPath
};
