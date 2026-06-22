import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import PublicLayout, { Seo } from '../components/PublicLayout';
import FoundingStoryCards from '../components/FoundingStoryCards';

const values = ['Dignity', 'Access', 'Early Awareness', 'Pain and Symptom Support', 'Cancer Awareness', 'Family Support', 'Community Health Education', 'Organized Care'];
const work = ['Health education', 'Community medical guidance', 'Cancer awareness', 'Referral support', 'Patient follow-up support', 'Digital health preparation', 'Future hospital planning'];
const roadmap = [
  ['Stage 1', 'Health education and community support', 'Current foundation'],
  ['Stage 2', 'Digital patient support and referral coordination', 'In development'],
  ['Stage 3', 'Partnerships and outreach programs', 'Planned'],
  ['Stage 4', 'Clinic-level services', 'Future'],
  ['Stage 5', 'Full hospital development', 'Long-term goal']
];

export function OurStory() {
  return <PublicLayout><Seo title="Our Story | BERWA HOSPITALS" description="The personal story of love, loss, and service that inspired the BERWA HOSPITALS health initiative and future hospital vision." />
    <PageHero eyebrow="Our story" title="BERWA HOSPITALS Began With Love, Loss, and a Decision to Help Others" text="After losing his little sister to abdominal cancer on 18 January 2026, the founder began building a health initiative that could support other families with education, guidance, and future hospital care." />
    <section className="mission-section"><div className="mission-container narrow"><h2>The first motivation behind BERWA HOSPITALS</h2><p>The founder’s little sister fought abdominal cancer for around three years. Her illness affected the family deeply and showed how serious disease reaches far beyond the body—into school, dreams, family stability, finances, hope, and every decision around care.</p><p>BERWA HOSPITALS carries her memory forward by working to support other people and families before they feel alone. We do not invent or publish private details about her treatment. Her story is shared simply, respectfully, and with family approval.</p><blockquote>Her life is remembered with dignity. Her story became a decision to help others find education, guidance, support, and more organized care.</blockquote></div></section>
    <section className="mission-section soft"><div className="mission-container split"><div><span className="eyebrow">From personal loss to public mission</span><h2>Starting where responsible help is possible today</h2><p>The project begins with health education, community support, referral guidance, cancer awareness, and digital preparation. The long-term goal is a hospital model built around dignity, access, organized care, and support for families facing serious illness.</p></div><div className="image-placeholder legacy">In her memory.<br />In service of others.</div></div></section>
    <section className="mission-section"><div className="mission-container"><div className="section-heading"><h2>What BERWA HOSPITALS Stands For</h2></div><div className="value-grid">{values.map(v => <article key={v}><span>◆</span><h3>{v}</h3></article>)}</div><CtaRow /></div></section>
  </PublicLayout>;
}

export function CurrentWork() {
  return <PublicLayout><Seo title="Current Work | BERWA HOSPITALS" description="Learn about BERWA HOSPITALS health education, community guidance, cancer awareness, referral support, and digital preparation." /><PageHero eyebrow="What exists now" title="Community Health Support Today" text="Our present work focuses on careful education, responsible guidance, awareness, and support—not on claiming hospital services that are not yet operating." /><section className="mission-section"><div className="mission-container"><div className="mission-card-grid">{work.map(item => <article className="mission-card" key={item}><span className="card-mark">+</span><h3>{item}</h3><p>Developing practical, community-centered support with honest limits and respect for licensed healthcare services.</p></article>)}</div><EmergencyNotice /><CtaRow /></div></section></PublicLayout>;
}

export function FutureVision() {
  return <PublicLayout><Seo title="Future Hospital Vision | BERWA HOSPITALS" description="Explore the planned roadmap for BERWA HOSPITALS, from community health support to a future modern hospital." /><PageHero eyebrow="A future hospital vision" title="Building Carefully, Stage by Stage" text="The long-term vision is a modern, accessible, organized hospital project shaped by a sister’s story and the needs of families facing serious illness." /><section className="mission-section"><div className="mission-container split"><div><h2>Why BERWA HOSPITALS is being built</h2><p>The project was born from the belief that people deserve earlier awareness, clearer guidance, dignified support, organized records, and care systems that recognize the whole family experience.</p><p>Planned areas include general medicine, maternal and child health, oncology support and referral, internal medicine, future emergency care, laboratory and pharmacy services, telemedicine, and community outreach.</p></div><div className="truth-card dark"><span>Future-focused language</span><h3>Planned · In development · Long-term goal</h3><p>None of these departments are presented as currently operating hospital services.</p></div></div></section><section className="mission-section soft"><div className="mission-container"><div className="section-heading"><h2>Development Roadmap</h2></div><div className="roadmap">{roadmap.map(([stage,title,status]) => <article key={stage}><span>{stage}</span><div><h3>{title}</h3><p>{status}</p></div></article>)}</div><CtaRow /></div></section></PublicLayout>;
}

export function Stories() {
  const [stories, setStories] = useState([]);
  const [filter, setFilter] = useState('All');
  useEffect(() => { api.get('/stories').then(r => setStories(r.data.stories)).catch(() => {}); }, []);
  const filtered = filter === 'All' ? stories : stories.filter(s => s.story_type.includes(filter));
  return <PublicLayout><Seo title="Stories of Hope and Support | BERWA HOSPITALS" description="Approved stories shared with dignity to show why health education, patient guidance, and future hospital care matter." /><PageHero eyebrow="Stories behind the mission" title="Stories of Hope and Support" text="Every story shared here is treated with dignity. Patient and family stories are published only with appropriate permission." /><section className="mission-section"><div className="mission-container"><div className="filter-row">{['All','Founding','Cancer','Child','Adult','Community','Legacy'].map(f => <button className={filter === f ? 'active' : ''} onClick={() => setFilter(f)} key={f}>{f}</button>)}</div><div className="story-grid">{filtered.map(story => <StoryCard story={story} key={story.id} />)}</div><div className="medical-notice">No private medical information should be posted publicly without consent. Display names and images follow each story’s privacy settings.</div></div></section></PublicLayout>;
}

export function StoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  useEffect(() => { api.get(`/stories/${slug}`).then(r => setStory(r.data.story)).catch(() => setStory(false)); }, [slug]);
  if (story === null) return <PublicLayout><div className="mission-container page-loading">Loading story…</div></PublicLayout>;
  if (!story) return <PublicLayout><div className="mission-container page-loading"><h1>Story not found</h1><Link to="/stories">Return to stories</Link></div></PublicLayout>;
  const founding = story.is_founding_story;
  return <PublicLayout><Seo title={`${story.title} | BERWA HOSPITALS`} description={story.story_summary} /><PageHero eyebrow={story.story_type} title={story.title} text={story.story_summary} /><section className="mission-section"><div className="mission-container"><div className="detail-images"><figure id="before-illness"><img src={story.before_image_url} alt={story.before_image_alt} /><figcaption>Before illness</figcaption></figure><figure id="during-illness"><img src={story.after_image_url} alt={story.after_image_alt} /><figcaption>{founding ? 'During her illness / Her legacy' : 'During illness / current need'}</figcaption></figure></div><div className="story-detail-grid"><article><h2>Dreams before illness</h2><p>{story.dreams_before_illness}</p><h2>What changed</h2><p>{story.what_changed}</p></article><aside><h3>{founding ? 'Her legacy' : 'Current support need'}</h3><p>{founding ? story.legacy_message : story.current_need}</p><h3>How support helps</h3><p>{story.support_needed}</p><Link className="mission-button warm" to="/donate">Support the Mission</Link></aside></div><div className="medical-notice">Consent: {story.consent_status}. This story is shared according to its approved privacy setting.</div></div></section></PublicLayout>;
}

export function HealthEducation() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  useEffect(() => { api.get('/health-education-posts').then(r => setPosts(r.data.posts)).catch(() => {}); }, []);
  const categories = ['All', ...new Set(posts.map(p => p.category))];
  const filtered = useMemo(() => posts.filter(p => (category === 'All' || p.category === category) && `${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase())), [posts, query, category]);
  return <PublicLayout><Seo title="Health Education | BERWA HOSPITALS" description="Community health education from BERWA HOSPITALS covering awareness, prevention, family health, and when to seek professional care." /><PageHero eyebrow="Learn and act early" title="Health Education" text="Clear educational information can help people ask better questions and seek qualified care earlier. It does not replace medical consultation." /><section className="mission-section"><div className="mission-container"><div className="education-tools"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search health topics…" /><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div><div className="mission-card-grid">{filtered.map(post => <article className="mission-card" key={post.id}><span className="story-type">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p><Link className="text-link" to={`/health-education/${post.slug}`}>Read article →</Link></article>)}</div><EmergencyNotice /><CtaRow /></div></section></PublicLayout>;
}

export function EducationDetail() {
  const { slug } = useParams(); const [post, setPost] = useState(null);
  useEffect(() => { api.get(`/health-education-posts/${slug}`).then(r => setPost(r.data.post)).catch(() => setPost(false)); }, [slug]);
  return <PublicLayout>{post ? <><Seo title={`${post.title} | BERWA HOSPITALS`} description={post.excerpt} /><PageHero eyebrow={post.category} title={post.title} text={post.excerpt} /><section className="mission-section"><article className="mission-container narrow article-copy"><p>{post.content}</p><EmergencyNotice /><CtaRow /></article></section></> : <div className="mission-container page-loading">Loading article…</div>}</PublicLayout>;
}

export function Contact() {
  return <PublicLayout><Seo title="Contact | BERWA HOSPITALS" description="Contact BERWA HOSPITALS about the growing health initiative, partnerships, support, and future hospital vision." /><PageHero eyebrow="Contact" title="Let’s Build Health Support Together" text="Contact us about the mission, responsible community support, partnership, volunteering, or future development." /><section className="mission-section"><div className="mission-container split"><div className="mission-card"><h2>Contact details</h2><p><strong>Email:</strong> berwahospitals@gmail.com</p><p><strong>Phone:</strong> +250 782 784 599</p><p><strong>Location:</strong> Kigali, Rwanda</p></div><div className="truth-card dark"><span>Urgent medical needs</span><h3>This website is not an emergency service.</h3><p>For severe or urgent symptoms, go to the nearest licensed health facility or contact local emergency services.</p></div></div></section></PublicLayout>;
}

function PageHero({ eyebrow, title, text }) { return <section className="page-hero"><div className="mission-container narrow"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section>; }
function EmergencyNotice() { return <div className="medical-notice"><strong>Medical disclaimer:</strong> This support does not replace emergency care, specialist consultation, or hospital treatment. For urgent symptoms, seek care from a licensed health facility immediately.</div>; }
function CtaRow() { return <div className="button-row centered-row section-cta"><Link className="mission-button warm" to="/donate">Support the Mission</Link><Link className="mission-button primary" to="/request-guidance">Request Health Guidance</Link><Link className="mission-button outline" to="/get-involved">Get Involved</Link></div>; }
function StoryCard({ story }) { if (story.is_founding_story) return <FoundingStoryCards story={story} />; return <article className="story-card"><div className="story-images"><img src={story.before_image_url} alt={story.before_image_alt} /><img src={story.after_image_url} alt={story.after_image_alt} /></div><div className="story-body"><span className="story-type">{story.story_type}</span><h3>{story.title}</h3><p><strong>{story.display_name}</strong>{story.age_group ? ` · ${story.age_group}` : ''}</p><p>{story.story_summary}</p><span className="consent-badge">{story.consent_status}</span><div className="button-row"><Link className="mission-button primary small" to={`/stories/${story.slug}`}>Read Story</Link><Link className="text-link" to="/donate">Support Mission →</Link></div></div></article>; }
