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

    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donation_reference TEXT UNIQUE NOT NULL,
      donation_type TEXT NOT NULL,
      currency TEXT NOT NULL,
      amount REAL NOT NULL,
      custom_amount REAL,
      support_area TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      city TEXT,
      message TEXT,
      is_anonymous INTEGER DEFAULT 0,
      consent_to_updates INTEGER DEFAULT 0,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'Pledge Received',
      pledge_status TEXT DEFAULT 'New',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS donor_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      country TEXT,
      city TEXT,
      consent_to_updates INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS donation_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      goal_amount REAL DEFAULT 0,
      amount_raised REAL DEFAULT 0,
      currency TEXT DEFAULT 'RWF',
      category TEXT,
      linked_story_id INTEGER,
      status TEXT DEFAULT 'Active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guidance_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_reference TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      phone TEXT NOT NULL,
      email TEXT,
      location TEXT,
      main_concern TEXT NOT NULL,
      symptoms_summary TEXT,
      duration TEXT,
      urgency_level TEXT,
      previous_diagnosis TEXT,
      current_medications TEXT,
      support_needed TEXT,
      consent INTEGER NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'New',
      internal_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS volunteer_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      city TEXT,
      interest_type TEXT,
      skills TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partner_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_name TEXT,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      city TEXT,
      partnership_type TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS motivational_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_reference TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      story_type TEXT NOT NULL,
      display_name TEXT NOT NULL,
      real_name_private TEXT,
      age_group TEXT,
      age_private_optional INTEGER,
      gender_optional TEXT,
      location_optional TEXT,
      before_image_url TEXT,
      before_image_alt TEXT,
      after_image_url TEXT,
      after_image_alt TEXT,
      dreams_before_illness TEXT,
      story_summary TEXT NOT NULL,
      what_changed TEXT,
      current_need TEXT,
      legacy_message TEXT,
      support_needed TEXT,
      donation_campaign_id INTEGER,
      consent_status TEXT NOT NULL,
      consent_notes TEXT,
      privacy_level TEXT NOT NULL,
      is_founding_story INTEGER DEFAULT 0,
      is_legacy_story INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      show_on_homepage INTEGER DEFAULT 0,
      show_on_donate_page INTEGER DEFAULT 0,
      publication_status TEXT DEFAULT 'Draft',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS health_education_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      publication_status TEXT DEFAULT 'Published',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS impact_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_key TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      metric_value INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_roadmap_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stage_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Planned',
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS support_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      report_month TEXT,
      publication_status TEXT DEFAULT 'Draft',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const foundingStory = db.prepare('SELECT id FROM motivational_stories WHERE slug = ?')
    .get('the-sister-who-inspired-berwa-hospitals');
  if (!foundingStory) {
    db.prepare(`INSERT INTO motivational_stories (
      story_reference, title, slug, story_type, display_name, before_image_url,
      before_image_alt, after_image_url, after_image_alt, dreams_before_illness,
      story_summary, what_changed, legacy_message, support_needed, consent_status,
      privacy_level, is_founding_story, is_legacy_story, is_featured,
      show_on_homepage, show_on_donate_page, publication_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1, 1, 1, 'Published')`)
      .run(
        'STORY-FOUNDING-001',
        'The Sister Who Inspired BERWA HOSPITALS',
        'the-sister-who-inspired-berwa-hospitals',
        'Founding Story',
        "Founder's Little Sister",
        '/before.jpg',
        'The founder’s little sister before her illness',
        '/after.jpg',
        'The founder’s little sister during her illness',
        'Before illness, she had dreams, family love, and a future ahead of her. Her story reminds us that illness can interrupt a life, but it should never erase a person’s dignity.',
        'She fought abdominal cancer for around three years and passed away on 18 January 2026. Her story became the first motivation behind BERWA HOSPITALS and its mission to support families facing serious illness.',
        'Her illness showed how serious disease can affect the body, family stability, studies, finances, and hope. It also showed why guidance, awareness, pain support, and organized care matter.',
        'BERWA HOSPITALS carries her memory forward through health education, community guidance, cancer awareness, and a future hospital vision.',
        'Support helps BERWA HOSPITALS expand health education, patient guidance, cancer awareness, and future care systems.',
        'Family Approved',
        'Public with display name'
      );
  }

  const campaigns = [
    ['In Memory of the Founder’s Sister', 'in-memory-of-the-founders-sister', 'Support the mission inspired by her life and legacy.', 25000000, 'Legacy'],
    ['Cancer Awareness Support', 'cancer-awareness-support', 'Help create careful, accessible cancer awareness resources.', 10000000, 'Cancer Awareness'],
    ['Patient Guidance Fund', 'patient-guidance-fund', 'Support responsible guidance, referral information, and follow-up.', 8000000, 'Patient Support'],
    ['Health Education Outreach', 'health-education-outreach', 'Help communities access practical health education.', 12000000, 'Health Education'],
    ['Digital Patient Support System', 'digital-patient-support-system', 'Build secure tools for guidance and future care coordination.', 30000000, 'Digital Health'],
    ['Future Hospital Foundation', 'future-hospital-foundation', 'Support planning and groundwork for the long-term hospital vision.', 100000000, 'Future Hospital']
  ];
  const insertCampaign = db.prepare('INSERT OR IGNORE INTO donation_campaigns (title, slug, description, goal_amount, currency, category) VALUES (?, ?, ?, ?, ?, ?)');
  campaigns.forEach(campaign => insertCampaign.run(campaign[0], campaign[1], campaign[2], campaign[3], 'RWF', campaign[4]));

  // Placeholder values only. Replace with verified real metrics before public reporting.
  const metrics = [
    ['education_reach', 'People reached through health education', 0],
    ['community_supported', 'Community members supported', 0],
    ['topics_shared', 'Health topics shared', 12],
    ['guidance_requests', 'Guidance requests received', 0],
    ['future_departments', 'Future services planned', 10],
    ['supporters', 'Supporters and volunteers', 0]
  ];
  const insertMetric = db.prepare('INSERT OR IGNORE INTO impact_metrics (metric_key, label, metric_value) VALUES (?, ?, ?)');
  metrics.forEach(metric => insertMetric.run(...metric));

  const education = [
    ['cancer-awareness', 'Cancer awareness', 'Cancer Awareness', 'Understanding warning signs and the importance of timely professional assessment.'],
    ['abdominal-symptoms', 'When abdominal symptoms need medical attention', 'Cancer Awareness', 'Persistent or severe abdominal symptoms deserve qualified medical assessment.'],
    ['hypertension-basics', 'Understanding hypertension', 'Chronic Conditions', 'Practical awareness about blood pressure and routine screening.'],
    ['diabetes-basics', 'Understanding diabetes', 'Chronic Conditions', 'Foundational information about diabetes prevention and follow-up.'],
    ['maternal-health', 'Maternal health', 'Family Health', 'General education for safer pregnancy and timely professional care.'],
    ['child-health', 'Child health', 'Family Health', 'Age-appropriate prevention, nutrition, and warning-sign awareness.'],
    ['mental-health', 'Mental health matters', 'Wellbeing', 'Recognizing distress and seeking qualified support early.'],
    ['nutrition', 'Everyday nutrition', 'Prevention', 'Balanced, locally practical nutrition education.'],
    ['infection-prevention', 'Infection prevention', 'Prevention', 'Hand hygiene, safer environments, and timely care.'],
    ['urgent-care', 'When to seek urgent care', 'Urgent Care', 'Warning signs that require immediate attention at a licensed health facility.'],
    ['pain-support', 'Pain awareness and support', 'Serious Illness', 'Pain should be assessed and managed by qualified healthcare professionals.'],
    ['family-support', 'Supporting a seriously ill family member', 'Serious Illness', 'Practical, dignified ways families can offer support without replacing clinical care.']
  ];
  const insertPost = db.prepare('INSERT OR IGNORE INTO health_education_posts (slug, title, category, excerpt, content) VALUES (?, ?, ?, ?, ?)');
  education.forEach(post => insertPost.run(post[0], post[1], post[2], post[3], `${post[3]} This educational content does not replace consultation with a licensed healthcare provider.`));
}

module.exports = {
  createSchema
};
