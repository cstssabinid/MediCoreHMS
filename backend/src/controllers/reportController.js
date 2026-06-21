const { connect } = require('../db');

function getReports(req, res) {
  const db = connect();
  const totalPatients = db.prepare('SELECT COUNT(*) AS count FROM patients').get().count;
  const totalAppointments = db.prepare('SELECT COUNT(*) AS count FROM appointments').get().count;
  const pendingBills = db.prepare("SELECT COUNT(*) AS count FROM invoices WHERE status != 'Paid'").get().count;
  const totalRevenue = db.prepare('SELECT COALESCE(SUM(paid),0) AS total FROM invoices').get().total;
  const labRequests = db.prepare('SELECT COUNT(*) AS count FROM lab_requests').get().count;
  const medicines = db.prepare('SELECT COUNT(*) AS count FROM medicines').get().count;
  db.close();
  res.json({
    totals: { totalPatients, totalAppointments, pendingBills, totalRevenue, labRequests, medicines }
  });
}

module.exports = { getReports };
