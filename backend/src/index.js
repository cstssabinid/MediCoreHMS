const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDatabase } = require('./db');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const auditRoutes = require('./routes/auditRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const labRoutes = require('./routes/labRoutes');
const billingRoutes = require('./routes/billingRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const publicRoutes = require('./routes/publicRoutes');
const initiativeRoutes = require('./routes/initiativeRoutes');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/public', publicRoutes);
app.use('/api', initiativeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Berwa HMS backend' });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Berwa HMS backend running on port ${port}`);
});
