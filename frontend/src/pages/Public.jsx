import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PublicLayout, { Seo } from '../components/PublicLayout';
import FoundingStoryCards from '../components/FoundingStoryCards';

const currentWork = [
  ['Health Education', 'Clear, practical information that encourages prevention and timely professional care.'],
  ['Community Medical Guidance', 'Responsible support to help people understand appropriate next steps.'],
  ['Disease Prevention Awareness', 'Community-centered awareness about preventable illness and early attention.'],
  ['Basic Medical Assistance', 'Growing support efforts shaped by available resources and qualified supervision.'],
  ['Referral Guidance', 'Helping people identify suitable licensed facilities and services.'],
  ['Patient Support and Follow-up', 'Respectful check-ins and guidance for people navigating serious illness.']
];

const futureServices = ['General Medicine', 'Maternal and Child Health', 'Oncology Support and Referral', 'Internal Medicine', 'Emergency Care', 'Laboratory Services', 'Pharmacy Services', 'Digital Patient Records', 'Telemedicine', 'Community Health Programs'];

const heroSlides = [
  { src: '/landing_page1.jpg', alt: 'BERWA HOSPITALS community health presentation' },
  { src: '/landing_page2.jpg', alt: 'BERWA HOSPITALS health professional at a desk' },
  { src: '/landing_page3.jpg', alt: 'BERWA HOSPITALS team member offering guidance' },
  { src: '/landing_page4.jpg', alt: 'BERWA HOSPITALS health education and support' },
  { src: '/landing_page5.jpg', alt: 'BERWA HOSPITALS community care professional' }
];

function Public() {
  const [stories, setStories] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);

  useEffect(() => {
    api.get('/stories/featured').then(r => setStories(r.data.stories)).catch(() => {});
    api.get('/impact-metrics').then(r => setMetrics(r.data.metrics)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isSlideshowPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isSlideshowPaused]);

  return (
    <PublicLayout>
      <Seo title="BERWA HOSPITALS | Health Support Today, Hospital Vision Tomorrow" description="BERWA HOSPITALS is a growing Rwandan health initiative offering education and community guidance while preparing a future hospital vision." />
      <section
        className="mission-hero landing-hero"
        aria-roledescription="carousel"
        aria-label="BERWA HOSPITALS introduction"
        onMouseEnter={() => setIsSlideshowPaused(true)}
        onMouseLeave={() => setIsSlideshowPaused(false)}
      >
        <div className="hero-slides" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <div
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
              key={slide.src}
              style={{ backgroundImage: `url(${slide.src})` }}
            />
          ))}
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="mission-container hero-grid landing-hero-content">
          <div className="hero-glass-card hero-main-card">
            <span className="eyebrow">Health support today · Hospital vision tomorrow</span>
            <h1>Building BERWA HOSPITALS, Starting With Community Health Support</h1>
            <p>BERWA HOSPITALS is a growing health initiative inspired by personal family loss and a long-term vision to build a modern hospital. Today, our work begins with health education, responsible medical guidance, patient support, and community care.</p>
            <div className="button-row">
              <Link className="mission-button warm" to="/donate">Support the Mission</Link>
              <Link className="mission-button light" to="/our-story">Read Our Story</Link>
              <Link className="mission-button outline" to="/request-guidance">Request Health Guidance</Link>
              <Link className="text-link" to="/future-hospital-vision">Explore the Future Vision →</Link>
            </div>
          </div>
          <aside className="truth-card hero-glass-card">
            <span>Where we are now</span>
            <h2>A growing health initiative</h2>
            <p>We are not yet a fully operational hospital. We are building a responsible foundation through education, guidance, community support, digital preparation, and long-term planning.</p>
          </aside>
        </div>
        <div className="hero-controls" aria-label="Choose a background image">
          {heroSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.src}
              className={index === activeSlide ? 'active' : ''}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}: ${slide.alt}`}
              aria-current={index === activeSlide ? 'true' : undefined}
            />
          ))}
          <button
            type="button"
            className="slideshow-toggle"
            onClick={() => setIsSlideshowPaused(paused => !paused)}
            aria-label={isSlideshowPaused ? 'Play background slideshow' : 'Pause background slideshow'}
          >
            {isSlideshowPaused ? 'Play' : 'Pause'}
          </button>
        </div>
      </section>

      <section className="mission-section story-band">
        <div className="mission-container split">
          <div className="image-placeholder legacy">A life remembered.<br />A mission carried forward.</div>
          <div>
            <span className="eyebrow">The heart of the mission</span>
            <h2>Born From a Sister’s Story</h2>
            <p>BERWA HOSPITALS began with a personal story. The founder’s little sister fought abdominal cancer for nearly three years and passed away on 18 January 2026. Her struggle revealed how much families need guidance, support, pain awareness, early attention, and organized care when serious illness enters their home.</p>
            <p>Her memory became the first and strongest motivation behind this project.</p>
            <div className="button-row">
              <Link className="mission-button primary" to="/our-story">Read the Founding Story</Link>
              <Link className="mission-button warm" to="/donate">Support the Mission</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-container">
          <div className="section-heading"><span className="eyebrow">Present work</span><h2>What We Are Doing Now</h2><p>Practical, careful support while the larger hospital vision is being developed.</p></div>
          <div className="mission-card-grid">{currentWork.map(([title, text]) => <article className="mission-card" key={title}><span className="card-mark">+</span><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="medical-notice"><strong>Important:</strong> Current support does not replace emergency care or hospital treatment. People with urgent symptoms should seek care from a licensed health facility immediately.</div>
        </div>
      </section>

      <section className="mission-section soft">
        <div className="mission-container">
          <div className="section-heading"><span className="eyebrow">A long-term goal</span><h2>The Future BERWA HOSPITALS Vision</h2><p>Planned services are future goals—not claims of services currently operating.</p></div>
          <div className="vision-grid">{futureServices.map((name, index) => <article key={name}><span>{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3><p>Planned · In development</p></article>)}</div>
          <Link className="mission-button primary centered" to="/future-hospital-vision">See the Development Roadmap</Link>
        </div>
      </section>

      <section className="mission-section impact-band">
        <div className="mission-container">
          <div className="section-heading light-heading"><span className="eyebrow">Growing responsibly</span><h2>Our Developing Impact</h2><p>Metrics remain placeholders until verified real reporting is available.</p></div>
          <div className="metric-grid">{metrics.map(metric => <article key={metric.id}><strong>{metric.metric_value}</strong><span>{metric.label}</span><small>{metric.is_verified ? 'Verified' : 'Development metric'}</small></article>)}</div>
          <div className="button-row centered-row"><Link className="mission-button warm" to="/donate">Help Grow This Work</Link><Link className="mission-button light" to="/get-involved">Join the Mission</Link></div>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-container">
          <div className="section-heading"><span className="eyebrow">People, dignity, memory</span><h2>Stories Behind the Mission</h2></div>
          <div className="story-grid">
            {stories.map(story => story.is_founding_story
              ? <FoundingStoryCards story={story} key={story.id} />
              : <article className="story-card" key={story.id}>
              <div className="story-images"><img src={story.before_image_url} alt={story.before_image_alt} /><img src={story.after_image_url} alt={story.after_image_alt} /></div>
              <div className="story-body"><span className="story-type">{story.story_type}</span><h3>{story.title}</h3><p>{story.story_summary}</p><div className="button-row"><Link className="mission-button primary small" to={`/stories/${story.slug}`}>Read Story</Link><Link className="text-link" to="/donate">Support Mission →</Link></div></div>
            </article>)}
          </div>
          <Link className="mission-button outline centered" to="/stories">View All Stories</Link>
        </div>
      </section>

      <section className="mission-section donation-preview">
        <div className="mission-container split">
          <div><span className="eyebrow">Pledge support</span><h2>Help Build the Future of BERWA HOSPITALS</h2><p>Your pledge can support health education, patient guidance, community medical assistance, cancer awareness, digital system development, and careful preparation for the future hospital.</p><div className="medical-notice compact">Payment processing is currently in pledge/demo mode. No payment is collected on this website yet.</div></div>
          <div className="donation-callout"><h3>Every responsible beginning matters.</h3><p>Make a one-time pledge or express interest in monthly support. Our team will contact you with next steps.</p><Link className="mission-button warm" to="/donate">Donate / Support the Mission</Link></div>
        </div>
      </section>
    </PublicLayout>
  );
}

export default Public;
