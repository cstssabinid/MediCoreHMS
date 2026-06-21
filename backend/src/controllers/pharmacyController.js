const { connect } = require('../db');

function getMedicines(req, res) {
  const db = connect();
  const medicines = db.prepare('SELECT m.*, ps.quantity AS stock_quantity FROM medicines m LEFT JOIN pharmacy_stock ps ON ps.medicine_id = m.id ORDER BY m.name ASC').all();
  db.close();
  res.json({ medicines });
}

function updateStock(req, res) {
  const { quantity } = req.body;
  const medicineId = req.params.id;
  const db = connect();
  const medicine = db.prepare('SELECT * FROM medicines WHERE id = ?').get(medicineId);
  if (!medicine) {
    db.close();
    return res.status(404).json({ error: 'Medicine not found' });
  }
  const current = db.prepare('SELECT * FROM pharmacy_stock WHERE medicine_id = ?').get(medicineId);
  if (current) {
    db.prepare('UPDATE pharmacy_stock SET quantity = ?, last_updated = datetime("now") WHERE medicine_id = ?').run(quantity, medicineId);
  } else {
    db.prepare('INSERT INTO pharmacy_stock (medicine_id, quantity) VALUES (?, ?)').run(medicineId, quantity);
  }
  db.close();
  res.json({ success: true });
}

function dispenseMedication(req, res) {
  const { medicine_id, quantity, patient_id, notes } = req.body;
  if (!medicine_id || !quantity || !patient_id) {
    return res.status(400).json({ error: 'Medicine, quantity, and patient are required' });
  }
  const db = connect();
  const stock = db.prepare('SELECT * FROM pharmacy_stock WHERE medicine_id = ?').get(medicine_id);
  if (!stock || stock.quantity < quantity) {
    db.close();
    return res.status(400).json({ error: 'Insufficient stock' });
  }
  db.prepare('UPDATE pharmacy_stock SET quantity = quantity - ?, last_updated = datetime("now") WHERE medicine_id = ?').run(quantity, medicine_id);
  const medicine = db.prepare('SELECT * FROM medicines WHERE id = ?').get(medicine_id);
  db.prepare('INSERT INTO invoice_items (invoice_id, description, amount) VALUES (?, ?, ?)').run(0, `Dispensed ${quantity} x ${medicine.name}`, medicine.unit_price * quantity);
  db.close();
  res.json({ success: true, medicine: medicine.name, remaining: stock.quantity - quantity });
}

module.exports = { getMedicines, updateStock, dispenseMedication };
