require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { createSchema } = require('../models/schema');

const dbPath = path.resolve(
  process.env.DATABASE_FILE || path.join(__dirname, '..', '..', 'data', 'berwa_hms.db')
);

const dataFolder = path.dirname(dbPath);
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

const db = new Database(dbPath);
createSchema(db);
const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
db.close();

if (userCount === 0) {
  console.log('Database is empty; loading initial demo data...');
  require('./seed');
} else {
  console.log('Database already contains data; skipping seed.');
}
