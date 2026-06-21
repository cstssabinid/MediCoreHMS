const bcrypt = require('bcryptjs');

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(role_id) REFERENCES roles(id)
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth TEXT,
      gender TEXT,
      phone TEXT,
      address TEXT,
      national_id TEXT,
      insurance_provider TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      medical_history TEXT,
      allergies TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_code TEXT UNIQUE NOT NULL,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER,
      department TEXT,
      scheduled_at TEXT,
      status TEXT DEFAULT 'Scheduled',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(doctor_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      nurse_id INTEGER NOT NULL,
      visit_id INTEGER,
      blood_pressure TEXT,
      pulse_rate INTEGER,
      respiratory_rate INTEGER,
      temperature REAL,
      oxygen_saturation INTEGER,
      weight REAL,
      height REAL,
      bmi REAL,
      chief_complaint TEXT,
      notes TEXT,
      recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(nurse_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      appointment_id INTEGER,
      visit_reason TEXT,
      history_present_illness TEXT,
      past_medical_history TEXT,
      physical_exam TEXT,
      diagnosis TEXT,
      treatment_plan TEXT,
      referral_notes TEXT,
      follow_up_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(doctor_id) REFERENCES users(id),
      FOREIGN KEY(appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultation_id INTEGER NOT NULL,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      status TEXT DEFAULT 'Pending',
      instructions TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(consultation_id) REFERENCES consultations(id),
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(doctor_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS prescription_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prescription_id INTEGER NOT NULL,
      medicine_name TEXT NOT NULL,
      dosage TEXT,
      frequency TEXT,
      duration TEXT,
      route TEXT,
      notes TEXT,
      FOREIGN KEY(prescription_id) REFERENCES prescriptions(id)
    );

    CREATE TABLE IF NOT EXISTS lab_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      requested_by INTEGER NOT NULL,
      test_name TEXT NOT NULL,
      priority TEXT DEFAULT 'Routine',
      status TEXT DEFAULT 'Requested',
      sample_collected_at TEXT,
      result_completed_at TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(requested_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS lab_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lab_request_id INTEGER NOT NULL,
      result_text TEXT,
      validated INTEGER DEFAULT 0,
      validated_by INTEGER,
      validated_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(lab_request_id) REFERENCES lab_requests(id),
      FOREIGN KEY(validated_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      quantity INTEGER DEFAULT 0,
      unit_price REAL DEFAULT 0,
      expiry_date TEXT,
      low_stock_threshold INTEGER DEFAULT 5,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pharmacy_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 0,
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(medicine_id) REFERENCES medicines(id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      invoice_number TEXT UNIQUE NOT NULL,
      consultation_fee REAL DEFAULT 0,
      lab_fee REAL DEFAULT 0,
      medication_fee REAL DEFAULT 0,
      procedure_fee REAL DEFAULT 0,
      insurance_coverage REAL DEFAULT 0,
      total REAL DEFAULT 0,
      paid REAL DEFAULT 0,
      status TEXT DEFAULT 'Unpaid',
      payment_method TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      amount REAL DEFAULT 0,
      FOREIGN KEY(invoice_id) REFERENCES invoices(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      paid_by INTEGER NOT NULL,
      amount REAL DEFAULT 0,
      method TEXT,
      payment_date TEXT DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY(invoice_id) REFERENCES invoices(id),
      FOREIGN KEY(paid_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity TEXT,
      entity_id INTEGER,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    -- Public site and additional models
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      name TEXT NOT NULL,
      overview TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      opening_hours TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      doctor_code TEXT UNIQUE,
      first_name TEXT,
      last_name TEXT,
      department_id INTEGER,
      qualifications TEXT,
      experience_years INTEGER,
      languages TEXT,
      bio TEXT,
      consultation_fee REAL DEFAULT 0,
      locations TEXT,
      consultation_type TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(department_id) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS doctor_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER NOT NULL,
      location_id INTEGER,
      day_of_week INTEGER,
      start_time TEXT,
      end_time TEXT,
      available INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(doctor_id) REFERENCES doctors(id),
      FOREIGN KEY(location_id) REFERENCES locations(id)
    );

    CREATE TABLE IF NOT EXISTS public_appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT UNIQUE,
      patient_name TEXT,
      patient_phone TEXT,
      patient_email TEXT,
      patient_dob TEXT,
      gender TEXT,
      location_id INTEGER,
      department_id INTEGER,
      doctor_id INTEGER,
      appointment_type TEXT,
      scheduled_at TEXT,
      status TEXT DEFAULT 'Requested',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(location_id) REFERENCES locations(id),
      FOREIGN KEY(department_id) REFERENCES departments(id),
      FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    );

    CREATE TABLE IF NOT EXISTS online_consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT UNIQUE,
      patient_name TEXT,
      patient_phone TEXT,
      patient_email TEXT,
      speciality_id INTEGER,
      doctor_id INTEGER,
      scheduled_at TEXT,
      fee REAL DEFAULT 0,
      status TEXT DEFAULT 'Requested',
      video_link TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(speciality_id) REFERENCES departments(id),
      FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    );

    CREATE TABLE IF NOT EXISTS second_opinion_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT UNIQUE,
      patient_name TEXT,
      contact TEXT,
      country TEXT,
      city TEXT,
      diagnosis TEXT,
      current_treatment TEXT,
      preferred_speciality INTEGER,
      uploaded_report TEXT,
      status TEXT DEFAULT 'Submitted',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(preferred_speciality) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS health_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      tests_included TEXT,
      price REAL DEFAULT 0,
      recommended_age_group TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS health_package_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER NOT NULL,
      patient_name TEXT,
      patient_phone TEXT,
      patient_email TEXT,
      scheduled_at TEXT,
      status TEXT DEFAULT 'Booked',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(package_id) REFERENCES health_packages(id)
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      title TEXT,
      excerpt TEXT,
      content TEXT,
      author TEXT,
      published_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patient_portal_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      email TEXT UNIQUE,
      password TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS medical_record_access_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portal_account_id INTEGER,
      accessed_by INTEGER,
      record_type TEXT,
      record_id INTEGER,
      action TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(portal_account_id) REFERENCES patient_portal_accounts(id),
      FOREIGN KEY(accessed_by) REFERENCES users(id)
    );
  `);
}

module.exports = {
  createSchema
};
