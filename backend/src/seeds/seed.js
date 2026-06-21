const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { createSchema } = require('../models/schema');

const dbPath = path.resolve(process.env.DATABASE_FILE || path.join(__dirname, '..', '..', 'data', 'berwa_hms.db'));
const dataFolder = path.dirname(dbPath);
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
createSchema(db);

db.exec('DELETE FROM audit_logs');
db.exec('DELETE FROM payments');
db.exec('DELETE FROM invoice_items');
db.exec('DELETE FROM invoices');
db.exec('DELETE FROM pharmacy_stock');
db.exec('DELETE FROM medicines');
db.exec('DELETE FROM lab_results');
db.exec('DELETE FROM lab_requests');
db.exec('DELETE FROM prescriptions');
db.exec('DELETE FROM prescription_items');
db.exec('DELETE FROM consultations');
db.exec('DELETE FROM vitals');
db.exec('DELETE FROM appointments');
db.exec('DELETE FROM patients');
db.exec('DELETE FROM users');

const roles = [
  { name: 'Super Admin' },
  { name: 'Hospital Admin' },
  { name: 'Receptionist' },
  { name: 'Doctor' },
  { name: 'Nurse' },
  { name: 'Laboratory Staff' },
  { name: 'Pharmacist' },
  { name: 'Cashier' }
];
const insertRole = db.prepare('INSERT OR IGNORE INTO roles (name, description) VALUES (?, ?)');
roles.forEach(role => insertRole.run(role.name, `${role.name} access`));

const roleIds = {};
for (const role of db.prepare('SELECT * FROM roles').all()) {
  roleIds[role.name] = role.id;
}

const users = [
  { first_name: 'Ayesha', last_name: 'Rao', email: 'admin@berwa.com', password: 'Admin123!', role: 'Super Admin' },
  { first_name: 'Imran', last_name: 'Khan', email: 'hospital@berwa.com', password: 'Hospital123!', role: 'Hospital Admin' },
  { first_name: 'Nadia', last_name: 'Ahmed', email: 'reception@berwa.com', password: 'Reception123!', role: 'Receptionist' },
  { first_name: 'Farah', last_name: 'Saeed', email: 'doctor@berwa.com', password: 'Doctor123!', role: 'Doctor' },
  { first_name: 'Salman', last_name: 'Malik', email: 'nurse@berwa.com', password: 'Nurse123!', role: 'Nurse' },
  { first_name: 'Zara', last_name: 'Hussain', email: 'lab@berwa.com', password: 'Lab123!', role: 'Laboratory Staff' },
  { first_name: 'Bilal', last_name: 'Shah', email: 'pharma@berwa.com', password: 'Pharma123!', role: 'Pharmacist' },
  { first_name: 'Mina', last_name: 'Raza', email: 'cashier@berwa.com', password: 'Cashier123!', role: 'Cashier' }
];
const insertUser = db.prepare('INSERT INTO users (first_name, last_name, email, password, role_id, active) VALUES (?, ?, ?, ?, ?, 1)');
users.forEach(user => insertUser.run(user.first_name, user.last_name, user.email.toLowerCase(), bcrypt.hashSync(user.password, 10), roleIds[user.role]));

const patients = [
  { first_name: 'Amina', last_name: 'Khan', date_of_birth: '1989-02-12', gender: 'Female', phone: '03001234567', address: '12 Garden Road', national_id: 'PID-1001', insurance_provider: 'CarePlus', emergency_contact_name: 'Bilal Khan', emergency_contact_phone: '03007654321', medical_history: 'Hypertension', allergies: 'Penicillin' },
  { first_name: 'Omar', last_name: 'Farooq', date_of_birth: '1976-10-05', gender: 'Male', phone: '03019876543', address: '9 River View', national_id: 'PID-1002', insurance_provider: 'HealthOne', emergency_contact_name: 'Sara Farooq', emergency_contact_phone: '03005551234', medical_history: 'Type 2 Diabetes', allergies: 'None' },
  { first_name: 'Hina', last_name: 'Aslam', date_of_birth: '2001-05-21', gender: 'Female', phone: '03008765432', address: '4 Maple Street', national_id: 'PID-1003', insurance_provider: 'MediCover', emergency_contact_name: 'Adeel Aslam', emergency_contact_phone: '03009998877', medical_history: 'Asthma', allergies: 'Dust' },
  { first_name: 'Ali', last_name: 'Bashir', date_of_birth: '1982-07-16', gender: 'Male', phone: '03017654321', address: '23 Hillcrest', national_id: 'PID-1004', insurance_provider: 'CarePlus', emergency_contact_name: 'Zainab Bashir', emergency_contact_phone: '03001112233', medical_history: 'None', allergies: 'Seafood' },
  { first_name: 'Zoya', last_name: 'Nawaz', date_of_birth: '1995-11-08', gender: 'Female', phone: '03014445566', address: '17 Elm Avenue', national_id: 'PID-1005', insurance_provider: 'HealthOne', emergency_contact_name: 'Saira Nawaz', emergency_contact_phone: '03002223344', medical_history: 'Migraine', allergies: 'None' },
  { first_name: 'Farhan', last_name: 'Iqbal', date_of_birth: '1978-03-30', gender: 'Male', phone: '03016667788', address: '31 Orchard Lane', national_id: 'PID-1006', insurance_provider: 'MediCover', emergency_contact_name: 'Nadia Iqbal', emergency_contact_phone: '03003334455', medical_history: 'High cholesterol', allergies: 'Peanuts' },
  { first_name: 'Saba', last_name: 'Zafar', date_of_birth: '1987-09-12', gender: 'Female', phone: '03018889900', address: '5 Cedar Park', national_id: 'PID-1007', insurance_provider: 'CarePlus', emergency_contact_name: 'Rashid Zafar', emergency_contact_phone: '03004445566', medical_history: 'Anemia', allergies: 'None' },
  { first_name: 'Rehan', last_name: 'Shahid', date_of_birth: '1992-12-27', gender: 'Male', phone: '03019998877', address: '8 Pine Crescent', national_id: 'PID-1008', insurance_provider: 'HealthOne', emergency_contact_name: 'Sumera Shahid', emergency_contact_phone: '03005556677', medical_history: 'Thyroid', allergies: 'Latex' },
  { first_name: 'Noreen', last_name: 'Imran', date_of_birth: '1969-06-18', gender: 'Female', phone: '03013334455', address: '2 Sunset Boulevard', national_id: 'PID-1009', insurance_provider: 'MediCover', emergency_contact_name: 'Imran Khan', emergency_contact_phone: '03006667788', medical_history: 'Arthritis', allergies: 'Sulfa drugs' },
  { first_name: 'Tariq', last_name: 'Javed', date_of_birth: '1984-01-02', gender: 'Male', phone: '03012223344', address: '11 Lakeside Drive', national_id: 'PID-1010', insurance_provider: 'CarePlus', emergency_contact_name: 'Bushra Javed', emergency_contact_phone: '03007778899', medical_history: 'Back pain', allergies: 'None' },
  { first_name: 'Mariam', last_name: 'Kareem', date_of_birth: '1990-04-11', gender: 'Female', phone: '03011112222', address: '14 Oak Street', national_id: 'PID-1011', insurance_provider: 'CarePlus', emergency_contact_name: 'Raza Kareem', emergency_contact_phone: '03008887766', medical_history: 'None', allergies: 'None' },
  { first_name: 'Saim', last_name: 'Qureshi', date_of_birth: '1986-08-02', gender: 'Male', phone: '03012224455', address: '6 Riverbend', national_id: 'PID-1012', insurance_provider: 'HealthOne', emergency_contact_name: 'Laila Qureshi', emergency_contact_phone: '03009990011', medical_history: 'Asthma', allergies: 'None' },
  { first_name: 'Rania', last_name: 'Saeed', date_of_birth: '1975-12-19', gender: 'Female', phone: '03013335566', address: '19 Willow Way', national_id: 'PID-1013', insurance_provider: 'MediCover', emergency_contact_name: 'Faraz Saeed', emergency_contact_phone: '03001113322', medical_history: 'Diabetes', allergies: 'None' },
  { first_name: 'Yasir', last_name: 'Nawaz', date_of_birth: '1998-06-06', gender: 'Male', phone: '03014446677', address: '3 Brook Lane', national_id: 'PID-1014', insurance_provider: 'CarePlus', emergency_contact_name: 'Ayesha Nawaz', emergency_contact_phone: '03005554433', medical_history: 'None', allergies: 'None' },
  { first_name: 'Lubna', last_name: 'Aziz', date_of_birth: '1981-02-28', gender: 'Female', phone: '03015557788', address: '22 Cedar Court', national_id: 'PID-1015', insurance_provider: 'HealthOne', emergency_contact_name: 'Zahid Aziz', emergency_contact_phone: '03006665544', medical_history: 'Hypertension', allergies: 'Sulfa' },
  { first_name: 'Danish', last_name: 'Khan', date_of_birth: '1993-09-09', gender: 'Male', phone: '03016668899', address: '7 Pine Road', national_id: 'PID-1016', insurance_provider: 'MediCover', emergency_contact_name: 'Rabia Khan', emergency_contact_phone: '03007776655', medical_history: 'Thyroid', allergies: 'None' },
  { first_name: 'Samina', last_name: 'Rauf', date_of_birth: '1972-03-03', gender: 'Female', phone: '03017779900', address: '10 Hill Road', national_id: 'PID-1017', insurance_provider: 'CarePlus', emergency_contact_name: 'Naveed Rauf', emergency_contact_phone: '03008889911', medical_history: 'Arthritis', allergies: 'None' },
  { first_name: 'Khalid', last_name: 'Jamil', date_of_birth: '1988-07-14', gender: 'Male', phone: '03018881122', address: '28 Maple Court', national_id: 'PID-1018', insurance_provider: 'HealthOne', emergency_contact_name: 'Amina Jamil', emergency_contact_phone: '03009992233', medical_history: 'None', allergies: 'Penicillin' },
  { first_name: 'Rimsha', last_name: 'Irfan', date_of_birth: '1996-10-30', gender: 'Female', phone: '03019993344', address: '15 Garden Lane', national_id: 'PID-1019', insurance_provider: 'MediCover', emergency_contact_name: 'Irfan Ali', emergency_contact_phone: '03001114455', medical_history: 'Migraine', allergies: 'None' },
  { first_name: 'Usman', last_name: 'Butt', date_of_birth: '1980-05-05', gender: 'Male', phone: '03010001122', address: '1 River Park', national_id: 'PID-1020', insurance_provider: 'CarePlus', emergency_contact_name: 'Sadia Butt', emergency_contact_phone: '03002225566', medical_history: 'High cholesterol', allergies: 'None' }
];
const insertPatient = db.prepare('INSERT INTO patients (patient_id, first_name, last_name, date_of_birth, gender, phone, address, national_id, insurance_provider, emergency_contact_name, emergency_contact_phone, medical_history, allergies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

patients.forEach((patient, index) => {
  const patientId = `P-${1000 + index}`;
  insertPatient.run(patientId, patient.first_name, patient.last_name, patient.date_of_birth, patient.gender, patient.phone, patient.address, patient.national_id, patient.insurance_provider, patient.emergency_contact_name, patient.emergency_contact_phone, patient.medical_history, patient.allergies);
});

const patientRows = db.prepare('SELECT id FROM patients ORDER BY id').all();
const userRows = db.prepare('SELECT id, role_id FROM users').all();

// Create departments
const departmentsList = ['Cardiology','Neurology','Oncology','Gastroenterology','Mother & Child','Orthopedics','Critical Care','Nephrology','Ophthalmology','Urology','Pediatrics','Pulmonology'];
const insertDept = db.prepare('INSERT OR IGNORE INTO departments (code, name, overview) VALUES (?, ?, ?)');
departmentsList.forEach((d, i) => insertDept.run(`D${100+i}`, d, `${d} services overview.`));

// Create locations
const locations = [
  { name: 'BERWA HOSPITALS Kigali Central', address: '1 Central Ave, Kigali', phone: '+250 782 784 599', opening_hours: '24/7' },
  { name: 'BERWA HOSPITALS Nyarugenge Medical Centre', address: '12 Nyarugenge Rd, Kigali', phone: '+250 786 664 709', opening_hours: 'Mon-Fri 8:00-18:00' },
  { name: 'BERWA HOSPITALS Remera Specialty Clinic', address: '5 Remera St, Kigali', phone: '+250 782 784 599', opening_hours: 'Mon-Sat 8:00-16:00' },
  { name: 'BERWA HOSPITALS Kicukiro Community Clinic', address: '9 Kicukiro Ln, Kigali', phone: '+250 786 664 709', opening_hours: 'Mon-Fri 9:00-17:00' }
];
const insertLoc = db.prepare('INSERT OR IGNORE INTO locations (name, address, phone, opening_hours) VALUES (?, ?, ?, ?)');
locations.forEach(l => insertLoc.run(l.name, l.address, l.phone, l.opening_hours));

// Create doctors (8)
const deptRows = db.prepare('SELECT * FROM departments').all();
const locRows = db.prepare('SELECT * FROM locations').all();
const insertDoctor = db.prepare('INSERT INTO doctors (user_id, doctor_code, first_name, last_name, department_id, qualifications, experience_years, languages, bio, consultation_fee, locations, consultation_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const sampleDoctors = [
  ['Aftab','Rahman','Cardiology', 'MBBS, FCPS',10,'English,Kinyarwanda','Experienced cardiologist',120,'Kigali Central Hospital','Both'],
  ['Beatrice','Uwimana','Neurology','MBBS, MD',8,'English,French','Neurologist with stroke expertise',140,'Nyarugenge Medical Centre','In-person'],
  ['Charles','Mukasa','Oncology','MBBS, MRCP',12,'English','Medical oncologist',200,'Remera Specialty Clinic','Both'],
  ['Diana','Niyonsaba','Gastroenterology','MBBS, MRCP',9,'English,Kinyarwanda','GI specialist',100,'Kigali Central Hospital','In-person'],
  ['Elias','Kamanzi','Pediatrics','MBBS, FCPS',7,'English','Paediatrician',80,'Kicukiro Community Clinic','Both'],
  ['Fatima','Uwase','Orthopedics','MBBS, MS',11,'English','Orthopedic surgeon',150,'Kigali Central Hospital','In-person'],
  ['George','Habimana','Pulmonology','MBBS, FRCP',6,'English','Respiratory specialist',110,'Remera Specialty Clinic','Both'],
  ['Hajira','Musa','Nephrology','MBBS, MD',13,'English','Nephrologist',180,'Nyarugenge Medical Centre','Both']
];
sampleDoctors.forEach((d, idx) => {
  const dept = deptRows.find(r => r.name.toLowerCase().includes(d[2].toLowerCase())) || deptRows[0];
  const loc = locRows[idx % locRows.length];
  insertDoctor.run(null, `DR-${3000+idx}`, d[0], d[1], dept.id, d[3], d[4], d[5], d[6], d[7], loc.name, d[8]);
});

// Doctor schedules (simple)
const doctors = db.prepare('SELECT * FROM doctors').all();
const insertSchedule = db.prepare('INSERT INTO doctor_schedules (doctor_id, location_id, day_of_week, start_time, end_time, available) VALUES (?, ?, ?, ?, ?, ?)');
doctors.forEach((doc, i) => {
  const loc = locRows[i % locRows.length];
  for (let d = 1; d <= 5; d++) {
    insertSchedule.run(doc.id, loc.id, d, '09:00', '13:00', 1);
    insertSchedule.run(doc.id, loc.id, d, '14:00', '17:00', 1);
  }
});

// Create public appointments (10)
const appointmentStmt = db.prepare('INSERT INTO public_appointments (reference, patient_name, patient_phone, patient_email, patient_dob, gender, location_id, department_id, doctor_id, appointment_type, scheduled_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const appointmentTimes = ['2026-06-21T09:30:00','2026-06-21T10:15:00','2026-06-21T11:00:00','2026-06-22T14:00:00','2026-06-22T15:30:00','2026-06-23T08:45:00','2026-06-23T13:15:00','2026-06-24T16:00:00','2026-06-25T10:00:00','2026-06-25T11:30:00'];
for (let i = 0; i < 10; i++) {
  const code = `PA-${4000+i}`;
  const p = patients[i % patients.length];
  const doc = doctors[i % doctors.length];
  const dept = deptRows.find(d => d.id === doc.department_id) || deptRows[0];
  const loc = locRows[i % locRows.length];
  appointmentStmt.run(code, `${p.first_name} ${p.last_name}`, p.phone, `${p.first_name.toLowerCase()}@example.com`, p.date_of_birth, p.gender, loc.id, dept.id, doc.id, 'In-person', appointmentTimes[i], 'Requested');
}

// Online consultations (5)
const onlineStmt = db.prepare('INSERT INTO online_consultations (reference, patient_name, patient_phone, patient_email, speciality_id, doctor_id, scheduled_at, fee, status, video_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
for (let i = 0; i < 5; i++) {
  const code = `OC-${5000+i}`;
  const p = patients[(i+5) % patients.length];
  const doc = doctors[i % doctors.length];
  onlineStmt.run(code, `${p.first_name} ${p.last_name}`, p.phone, `${p.first_name.toLowerCase()}@example.com`, doc.department_id, doc.id, appointmentTimes[i], doc.consultation_fee || 0, 'Requested', `https://video.example.com/${code}`);
}

// Second opinion requests (5)
const secondStmt = db.prepare('INSERT INTO second_opinion_requests (reference, patient_name, contact, country, city, diagnosis, current_treatment, preferred_speciality, uploaded_report, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
for (let i = 0; i < 5; i++) {
  const code = `SO-${6000+i}`;
  const p = patients[(i+2) % patients.length];
  const pref = deptRows[i % deptRows.length];
  secondStmt.run(code, `${p.first_name} ${p.last_name}`, p.phone, 'Rwanda', 'Kigali', 'Request for second opinion', 'Current treatment details', pref.id, null, 'Submitted');
}

// Health packages (6)
const insertPkg = db.prepare('INSERT INTO health_packages (code, name, description, tests_included, price, recommended_age_group) VALUES (?, ?, ?, ?, ?, ?)');
const packages = [
  ['PKG-BASIC','Basic Health Checkup','Essential tests for general health','CBC;Blood glucose;Urinalysis',25,'18-60'],
  ['PKG-EXEC','Executive Checkup','Extended health screening','CBC;LFT;RFT;Lipid profile',120,'30-65'],
  ['PKG-WOMEN','Women Health','Women focused tests','Pap smear;Mammogram;CBC',90,'18-60'],
  ['PKG-DIAB','Diabetes Screening','Glucose and related tests','Fasting glucose;HbA1c',40,'30-70'],
  ['PKG-CARD','Cardiac Screening','Heart risk assessment','ECG;Lipid profile;Echo (if needed)',150,'40-80'],
  ['PKG-CANCER','Cancer Screening','Screening package for common cancers','PSA;Mammogram;Pap smear',200,'40-75']
];
packages.forEach(p => insertPkg.run(p[0], p[1], p[2], p[3], p[4], p[5]));

// Blog posts (5)
const insertPost = db.prepare('INSERT INTO blog_posts (slug, title, excerpt, content, author, published_at) VALUES (?, ?, ?, ?, ?, ?)');
for (let i = 1; i <= 5; i++) {
  insertPost.run(`post-${i}`, `Health Article ${i}`, `Short excerpt for article ${i}.`, `Full content body for article ${i}.`, 'Berwa Editorial', `2026-06-${10+i}`);
}

const labStmt = db.prepare('INSERT INTO lab_requests (patient_id, requested_by, test_name, priority, status, notes) VALUES (?, ?, ?, ?, ?, ?)');
const labTests = ['CBC', 'Blood glucose', 'Urinalysis', 'Liver function tests', 'HIV test'];
for (let i = 0; i < labTests.length; i++) {
  labStmt.run(patientRows[i].id, userRows.find(u => u.role_id === roleIds['Doctor']).id, labTests[i], i === 4 ? 'Urgent' : 'Routine', 'Requested', 'Seed lab request');
}

const medicineStmt = db.prepare('INSERT INTO medicines (name, category, quantity, unit_price, expiry_date, low_stock_threshold) VALUES (?, ?, ?, ?, ?, ?)');
const medicines = [
  ['Paracetamol', 'Analgesic', 120, 0.25, '2027-04-01', 15],
  ['Amoxicillin', 'Antibiotic', 54, 0.95, '2026-11-15', 10],
  ['Aspirin', 'Analgesic', 85, 0.30, '2028-02-20', 10],
  ['Metformin', 'Antidiabetic', 40, 1.50, '2027-08-05', 8],
  ['Cetirizine', 'Antihistamine', 66, 0.40, '2026-12-31', 12]
];
medicines.forEach((item) => medicineStmt.run(...item));

const invoiceStmt = db.prepare('INSERT INTO invoices (patient_id, created_by, invoice_number, consultation_fee, lab_fee, medication_fee, procedure_fee, insurance_coverage, total, paid, status, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const invoiceItemsStmt = db.prepare('INSERT INTO invoice_items (invoice_id, description, amount) VALUES (?, ?, ?)');
const invoiceData = [
  { patient: patientRows[0].id, total: 42.5, consultation: 15, lab: 20, medication: 7.5, insurance: 0, paid: 42.5, status: 'Paid', method: 'Cash' },
  { patient: patientRows[1].id, total: 82, consultation: 15, lab: 50, medication: 17, insurance: 0, paid: 30, status: 'Partially Paid', method: 'Card' },
  { patient: patientRows[2].id, total: 35, consultation: 15, lab: 0, medication: 20, insurance: 0, paid: 0, status: 'Unpaid', method: 'Insurance' }
];
const cashier = userRows.find(u => u.role_id === roleIds['Cashier']).id;
invoiceData.forEach(item => {
  const code = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  const info = invoiceStmt.run(item.patient, cashier, code, item.consultation, item.lab, item.medication, item.procedure || 0, item.insurance, item.total, item.paid, item.status, item.method);
  invoiceItemsStmt.run(info.lastInsertRowid, 'Consultation fee', item.consultation);
  if (item.lab) invoiceItemsStmt.run(info.lastInsertRowid, 'Lab services', item.lab);
  if (item.medication) invoiceItemsStmt.run(info.lastInsertRowid, 'Medication', item.medication);
});

const auditStmt = db.prepare('INSERT INTO audit_logs (user_id, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?)');
auditStmt.run(userRows[0].id, 'Seed database', 'system', null, 'Initial seed data created');

db.close();
console.log('Database seeded at', dbPath);
