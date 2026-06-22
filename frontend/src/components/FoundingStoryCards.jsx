import { Link } from 'react-router-dom';

function FoundingStoryCards({ story }) {
  const storyUrl = `/stories/${story.slug}`;

  return (
    <article className="founding-story-feature">
      <div className="founding-story-heading">
        <span className="story-type">Founding Story</span>
        <h3>{story.title}</h3>
        <p>{story.story_summary}</p>
      </div>
      <div className="founding-story-pair">
        <Link className="story-chapter-card" to={`${storyUrl}#before-illness`}>
          <div className="story-chapter-image">
            <img src={story.before_image_url} alt={story.before_image_alt} />
            <span>Before illness</span>
          </div>
          <div className="story-chapter-copy">
            <p className="chapter-number">Chapter one</p>
            <h4>Her Life, Dreams, and the Future Ahead</h4>
            <p>{story.dreams_before_illness || story.story_summary}</p>
            <strong>Read this part of her story →</strong>
          </div>
        </Link>
        <Link className="story-chapter-card legacy-chapter" to={`${storyUrl}#during-illness`}>
          <div className="story-chapter-image">
            <img src={story.after_image_url} alt={story.after_image_alt} />
            <span>During her illness</span>
          </div>
          <div className="story-chapter-copy">
            <p className="chapter-number">Chapter two</p>
            <h4>Her Courage and the Mission She Inspired</h4>
            <p>{story.what_changed || story.legacy_message}</p>
            <strong>Read about her legacy →</strong>
          </div>
        </Link>
      </div>
      <div className="founding-story-actions">
        <Link className="mission-button primary" to={storyUrl}>Read Her Full Story</Link>
        <Link className="mission-button warm" to="/donate">Support the Mission</Link>
      </div>
    </article>
  );
}

export default FoundingStoryCards;
