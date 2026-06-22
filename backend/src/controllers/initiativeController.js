const { connect } = require('../db');

const bool = value => value === true || value === 1 || value === '1';
const reference = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

function createDonation(req, res) {
  const { donation_type, currency, amount, custom_amount, support_area, first_name, last_name, email, phone, country, city, message, is_anonymous, consent_to_updates, payment_method } = req.body;
  const finalAmount = Number(custom_amount || amount);
  if (!donation_type || !currency || !support_area || !first_name || !last_name || !email || !Number.isFinite(finalAmount) || finalAmount <= 0) {
    return res.status(400).json({ error: 'Please complete all required pledge fields with a valid amount.' });
  }
  const db = connect();
  const donationReference = reference('BH-PLEDGE');
  const info = db.prepare(`INSERT INTO donations (
    donation_reference, donation_type, currency, amount, custom_amount, support_area,
    first_name, last_name, email, phone, country, city, message, is_anonymous,
    consent_to_updates, payment_method
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    donationReference, donation_type, currency, finalAmount, custom_amount || null, support_area,
    first_name, last_name, email, phone || null, country || null, city || null, message || null,
    bool(is_anonymous) ? 1 : 0, bool(consent_to_updates) ? 1 : 0, payment_method || null
  );
  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(info.lastInsertRowid);
  db.prepare(`INSERT INTO donor_profiles (email, first_name, last_name, phone, country, city, consent_to_updates)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET first_name=excluded.first_name, last_name=excluded.last_name,
    phone=excluded.phone, country=excluded.country, city=excluded.city,
    consent_to_updates=excluded.consent_to_updates, updated_at=CURRENT_TIMESTAMP`)
    .run(email, first_name, last_name, phone || null, country || null, city || null, bool(consent_to_updates) ? 1 : 0);
  db.close();
  res.status(201).json({ donation });
}

function listDonations(req, res) {
  const db = connect();
  const donations = db.prepare('SELECT * FROM donations ORDER BY created_at DESC').all();
  db.close();
  res.json({ donations });
}

function getDonation(req, res) {
  const db = connect();
  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  db.close();
  if (!donation) return res.status(404).json({ error: 'Pledge not found' });
  res.json({ donation });
}

function updateDonationStatus(req, res) {
  const db = connect();
  db.prepare('UPDATE donations SET payment_status = coalesce(?, payment_status), pledge_status = coalesce(?, pledge_status) WHERE id = ?')
    .run(req.body.payment_status || null, req.body.pledge_status || null, req.params.id);
  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  db.close();
  if (!donation) return res.status(404).json({ error: 'Pledge not found' });
  res.json({ donation });
}

function listCampaigns(req, res) {
  const db = connect();
  const campaigns = db.prepare('SELECT * FROM donation_campaigns ORDER BY created_at DESC').all();
  db.close();
  res.json({ campaigns });
}

function saveCampaign(req, res) {
  const { title, slug, description, goal_amount, amount_raised, currency, category, linked_story_id, status } = req.body;
  if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required.' });
  const db = connect();
  const info = db.prepare(`INSERT INTO donation_campaigns (title, slug, description, goal_amount, amount_raised, currency, category, linked_story_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(title, slug, description || null, goal_amount || 0, amount_raised || 0, currency || 'RWF', category || null, linked_story_id || null, status || 'Active');
  const campaign = db.prepare('SELECT * FROM donation_campaigns WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ campaign });
}

function updateCampaign(req, res) {
  const db = connect();
  const existing = db.prepare('SELECT * FROM donation_campaigns WHERE id = ?').get(req.params.id);
  if (!existing) { db.close(); return res.status(404).json({ error: 'Campaign not found' }); }
  const next = { ...existing, ...req.body };
  db.prepare(`UPDATE donation_campaigns SET title=?, slug=?, description=?, goal_amount=?, amount_raised=?, currency=?, category=?, linked_story_id=?, status=? WHERE id=?`)
    .run(next.title, next.slug, next.description, next.goal_amount, next.amount_raised, next.currency, next.category, next.linked_story_id, next.status, req.params.id);
  const campaign = db.prepare('SELECT * FROM donation_campaigns WHERE id = ?').get(req.params.id);
  db.close();
  res.json({ campaign });
}

function createGuidanceRequest(req, res) {
  const { full_name, age, gender, phone, email, location, main_concern, symptoms_summary, duration, urgency_level, previous_diagnosis, current_medications, support_needed, consent } = req.body;
  if (!full_name || !phone || !main_concern || !bool(consent)) return res.status(400).json({ error: 'Name, phone, concern, and consent are required.' });
  const db = connect();
  const requestReference = reference('BH-GUIDE');
  const info = db.prepare(`INSERT INTO guidance_requests (
    request_reference, full_name, age, gender, phone, email, location, main_concern,
    symptoms_summary, duration, urgency_level, previous_diagnosis, current_medications,
    support_needed, consent
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`).run(
    requestReference, full_name, age || null, gender || null, phone, email || null, location || null,
    main_concern, symptoms_summary || null, duration || null, urgency_level || 'Routine',
    previous_diagnosis || null, current_medications || null, support_needed || null
  );
  const guidanceRequest = db.prepare('SELECT * FROM guidance_requests WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ guidanceRequest });
}

function listGuidanceRequests(req, res) {
  const db = connect();
  const guidanceRequests = db.prepare('SELECT * FROM guidance_requests ORDER BY created_at DESC').all();
  db.close();
  res.json({ guidanceRequests });
}

function updateGuidanceStatus(req, res) {
  const db = connect();
  db.prepare('UPDATE guidance_requests SET status=coalesce(?, status), internal_notes=coalesce(?, internal_notes) WHERE id=?')
    .run(req.body.status || null, req.body.internal_notes || null, req.params.id);
  const guidanceRequest = db.prepare('SELECT * FROM guidance_requests WHERE id = ?').get(req.params.id);
  db.close();
  if (!guidanceRequest) return res.status(404).json({ error: 'Guidance request not found' });
  res.json({ guidanceRequest });
}

function createVolunteer(req, res) {
  const { full_name, email, phone, country, city, interest_type, skills, message } = req.body;
  if (!full_name || !email) return res.status(400).json({ error: 'Name and email are required.' });
  const db = connect();
  const info = db.prepare('INSERT INTO volunteer_applications (full_name, email, phone, country, city, interest_type, skills, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(full_name, email, phone || null, country || null, city || null, interest_type || null, skills || null, message || null);
  const application = db.prepare('SELECT * FROM volunteer_applications WHERE id=?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ application });
}

function listVolunteers(req, res) {
  const db = connect();
  const applications = db.prepare('SELECT * FROM volunteer_applications ORDER BY created_at DESC').all();
  db.close();
  res.json({ applications });
}

function updateVolunteer(req, res) {
  const db = connect();
  db.prepare('UPDATE volunteer_applications SET status=coalesce(?, status), notes=coalesce(?, notes) WHERE id=?')
    .run(req.body.status || null, req.body.notes || null, req.params.id);
  const application = db.prepare('SELECT * FROM volunteer_applications WHERE id=?').get(req.params.id);
  db.close();
  if (!application) return res.status(404).json({ error: 'Volunteer application not found' });
  res.json({ application });
}

function createPartnerInquiry(req, res) {
  const { organization_name, contact_name, email, phone, country, city, partnership_type, message } = req.body;
  if (!contact_name || !email) return res.status(400).json({ error: 'Contact name and email are required.' });
  const db = connect();
  const info = db.prepare('INSERT INTO partner_inquiries (organization_name, contact_name, email, phone, country, city, partnership_type, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(organization_name || null, contact_name, email, phone || null, country || null, city || null, partnership_type || null, message || null);
  const inquiry = db.prepare('SELECT * FROM partner_inquiries WHERE id=?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ inquiry });
}

function listPartnerInquiries(req, res) {
  const db = connect();
  const inquiries = db.prepare('SELECT * FROM partner_inquiries ORDER BY created_at DESC').all();
  db.close();
  res.json({ inquiries });
}

function updatePartner(req, res) {
  const db = connect();
  db.prepare('UPDATE partner_inquiries SET status=coalesce(?, status), notes=coalesce(?, notes) WHERE id=?')
    .run(req.body.status || null, req.body.notes || null, req.params.id);
  const inquiry = db.prepare('SELECT * FROM partner_inquiries WHERE id=?').get(req.params.id);
  db.close();
  if (!inquiry) return res.status(404).json({ error: 'Partner inquiry not found' });
  res.json({ inquiry });
}

function storyVisibilitySql() {
  return `publication_status='Published' AND privacy_level NOT IN ('Internal only', 'Fully private')`;
}

function sanitizeStory(story) {
  if (!story) return story;
  const { real_name_private, age_private_optional, consent_notes, ...safe } = story;
  if (safe.privacy_level === 'Public anonymous') safe.display_name = 'Anonymous';
  if (safe.privacy_level === 'Images hidden') {
    safe.before_image_url = '/story-before-placeholder.svg';
    safe.after_image_url = '/story-support-placeholder.svg';
  }
  return safe;
}

function listStories(req, res) {
  const db = connect();
  const stories = db.prepare(`SELECT * FROM motivational_stories WHERE ${storyVisibilitySql()} ORDER BY is_founding_story DESC, is_featured DESC, created_at DESC`).all().map(sanitizeStory);
  db.close();
  res.json({ stories });
}

function listAllStories(req, res) {
  const db = connect();
  const stories = db.prepare('SELECT * FROM motivational_stories ORDER BY created_at DESC').all();
  db.close();
  res.json({ stories });
}

function featuredStories(req, res) {
  const db = connect();
  const stories = db.prepare(`SELECT * FROM motivational_stories WHERE ${storyVisibilitySql()} AND is_featured=1 ORDER BY is_founding_story DESC LIMIT 3`).all().map(sanitizeStory);
  db.close();
  res.json({ stories });
}

function foundingStory(req, res) {
  const db = connect();
  const story = sanitizeStory(db.prepare(`SELECT * FROM motivational_stories WHERE ${storyVisibilitySql()} AND is_founding_story=1 LIMIT 1`).get());
  db.close();
  if (!story) return res.status(404).json({ error: 'Founding story not found' });
  res.json({ story });
}

function getStory(req, res) {
  const db = connect();
  const story = sanitizeStory(db.prepare(`SELECT * FROM motivational_stories WHERE slug=? AND ${storyVisibilitySql()}`).get(req.params.slug));
  db.close();
  if (!story) return res.status(404).json({ error: 'Story not found' });
  res.json({ story });
}

function saveStory(req, res) {
  const fields = ['story_reference','title','slug','story_type','display_name','real_name_private','age_group','age_private_optional','gender_optional','location_optional','before_image_url','before_image_alt','after_image_url','after_image_alt','dreams_before_illness','story_summary','what_changed','current_need','legacy_message','support_needed','donation_campaign_id','consent_status','consent_notes','privacy_level','is_founding_story','is_legacy_story','is_featured','show_on_homepage','show_on_donate_page','publication_status'];
  if (!req.body.title || !req.body.slug || !req.body.display_name || !req.body.story_summary || !req.body.consent_status || !req.body.privacy_level) {
    return res.status(400).json({ error: 'Required story fields are missing.' });
  }
  const data = { ...req.body, story_reference: req.body.story_reference || reference('BH-STORY') };
  const db = connect();
  const placeholders = fields.map(() => '?').join(',');
  const values = fields.map(field => ['is_founding_story','is_legacy_story','is_featured','show_on_homepage','show_on_donate_page'].includes(field) ? (bool(data[field]) ? 1 : 0) : (data[field] ?? null));
  const info = db.prepare(`INSERT INTO motivational_stories (${fields.join(',')}) VALUES (${placeholders})`).run(...values);
  const story = db.prepare('SELECT * FROM motivational_stories WHERE id=?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ story });
}

function updateStory(req, res) {
  const db = connect();
  const existing = db.prepare('SELECT * FROM motivational_stories WHERE id=?').get(req.params.id);
  if (!existing) { db.close(); return res.status(404).json({ error: 'Story not found' }); }
  const allowed = ['title','slug','story_type','display_name','real_name_private','age_group','before_image_url','before_image_alt','after_image_url','after_image_alt','dreams_before_illness','story_summary','what_changed','current_need','legacy_message','support_needed','donation_campaign_id','consent_status','consent_notes','privacy_level','is_founding_story','is_legacy_story','is_featured','show_on_homepage','show_on_donate_page','publication_status'];
  const keys = allowed.filter(key => Object.prototype.hasOwnProperty.call(req.body, key));
  if (keys.length) db.prepare(`UPDATE motivational_stories SET ${keys.map(key => `${key}=?`).join(',')}, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(...keys.map(key => key.startsWith('is_') || key.startsWith('show_') ? (bool(req.body[key]) ? 1 : 0) : req.body[key]), req.params.id);
  const story = db.prepare('SELECT * FROM motivational_stories WHERE id=?').get(req.params.id);
  db.close();
  res.json({ story });
}

function deleteStory(req, res) {
  const db = connect();
  db.prepare("UPDATE motivational_stories SET publication_status='Archived', updated_at=CURRENT_TIMESTAMP WHERE id=?").run(req.params.id);
  db.close();
  res.status(204).end();
}

function listEducation(req, res) {
  const db = connect();
  const posts = db.prepare("SELECT * FROM health_education_posts WHERE publication_status='Published' ORDER BY title").all();
  db.close();
  res.json({ posts });
}

function getEducationPost(req, res) {
  const db = connect();
  const post = db.prepare("SELECT * FROM health_education_posts WHERE slug=? AND publication_status='Published'").get(req.params.slug);
  db.close();
  if (!post) return res.status(404).json({ error: 'Article not found' });
  res.json({ post });
}

function saveEducationPost(req, res) {
  const { slug, title, category, excerpt, content, publication_status } = req.body;
  if (!slug || !title || !category) return res.status(400).json({ error: 'Slug, title, and category are required.' });
  const db = connect();
  const info = db.prepare('INSERT INTO health_education_posts (slug, title, category, excerpt, content, publication_status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(slug, title, category, excerpt || null, content || null, publication_status || 'Draft');
  const post = db.prepare('SELECT * FROM health_education_posts WHERE id=?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json({ post });
}

function listImpact(req, res) {
  const db = connect();
  const metrics = db.prepare('SELECT * FROM impact_metrics ORDER BY id').all();
  db.close();
  res.json({ metrics });
}

function updateImpact(req, res) {
  const db = connect();
  db.prepare('UPDATE impact_metrics SET metric_value=?, is_verified=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(Number(req.body.metric_value) || 0, bool(req.body.is_verified) ? 1 : 0, req.params.id);
  const metric = db.prepare('SELECT * FROM impact_metrics WHERE id=?').get(req.params.id);
  db.close();
  if (!metric) return res.status(404).json({ error: 'Metric not found' });
  res.json({ metric });
}

module.exports = {
  createDonation, listDonations, getDonation, updateDonationStatus,
  listCampaigns, saveCampaign, updateCampaign,
  createGuidanceRequest, listGuidanceRequests, updateGuidanceStatus,
  createVolunteer, listVolunteers, updateVolunteer, createPartnerInquiry, listPartnerInquiries, updatePartner,
  listStories, listAllStories, featuredStories, foundingStory, getStory, saveStory, updateStory, deleteStory,
  listEducation, getEducationPost, saveEducationPost, listImpact, updateImpact
};
