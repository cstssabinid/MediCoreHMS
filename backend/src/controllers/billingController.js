const { connect } = require('../db');

function createInvoice(req, res) {
  const { patient_id, created_by, consultation_fee, lab_fee, medication_fee, procedure_fee, insurance_coverage, payment_method } = req.body;
  if (!patient_id || !created_by) {
    return res.status(400).json({ error: 'Patient and creator are required' });
  }
  const total = (consultation_fee || 0) + (lab_fee || 0) + (medication_fee || 0) + (procedure_fee || 0) - (insurance_coverage || 0);
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  const db = connect();
  const info = db.prepare('INSERT INTO invoices (patient_id, created_by, invoice_number, consultation_fee, lab_fee, medication_fee, procedure_fee, insurance_coverage, total, paid, status, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)').run(
    patient_id,
    created_by,
    invoiceNumber,
    consultation_fee || 0,
    lab_fee || 0,
    medication_fee || 0,
    procedure_fee || 0,
    insurance_coverage || 0,
    total,
    'Unpaid',
    payment_method || null
  );
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ invoice });
}

function getInvoices(req, res) {
  const db = connect();
  const invoices = db.prepare('SELECT i.*, p.patient_id AS patient_code, p.first_name AS patient_first_name, p.last_name AS patient_last_name FROM invoices i JOIN patients p ON i.patient_id = p.id ORDER BY i.created_at DESC LIMIT 200').all();
  db.close();
  res.json({ invoices });
}

function getInvoiceById(req, res) {
  const db = connect();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  const items = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ?').all(req.params.id);
  db.close();
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json({ invoice, items });
}

function addPayment(req, res) {
  const { amount, method, notes } = req.body;
  const invoiceId = req.params.id;
  const paidBy = req.user.id;
  if (!amount || !method) {
    return res.status(400).json({ error: 'Payment amount and method are required' });
  }
  const db = connect();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoiceId);
  if (!invoice) {
    db.close();
    return res.status(404).json({ error: 'Invoice not found' });
  }
  const newPaid = invoice.paid + Number(amount);
  const status = newPaid >= invoice.total ? 'Paid' : 'Partially Paid';
  db.prepare('INSERT INTO payments (invoice_id, paid_by, amount, method, notes) VALUES (?, ?, ?, ?, ?)').run(invoiceId, paidBy, amount, method, notes || null);
  db.prepare('UPDATE invoices SET paid = ?, status = ? WHERE id = ?').run(newPaid, status, invoiceId);
  const payment = db.prepare('SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC LIMIT 1').get(invoiceId);
  db.close();
  res.json({ payment });
}

module.exports = { createInvoice, getInvoices, getInvoiceById, addPayment };
