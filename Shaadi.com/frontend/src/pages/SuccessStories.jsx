import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { content } from "../services/api";

function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const data = await content.getSuccessStories();
        setStories(Array.isArray(data.stories) ? data.stories : []);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  return (
    <>
      <section className="inner-hero stories-hero">
        <Navbar />

        <div className="container text-center inner-hero-content">
          <span>REAL CONNECTIONS</span>

          <h1>Stories that began with hello</h1>

          <p>
            Every connection has its own journey. These are a few
            stories from the Milan community.
          </p>
        </div>
      </section>

      <section className="stories-section">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : stories.length > 0 ? (
            stories.map((story, index) => (
              <article
                className={`story-row ${
                  index % 2 !== 0 ? "story-row-reverse" : ""
                }`}
                key={story.id}
              >
                <div className="story-image">
                  <img src={story.image} alt={story.names} />
                </div>

                <div className="story-content">
                  <span>{story.year}</span>

                  <h2>{story.names}</h2>

                  <p className="story-location">
                    <i className="bi bi-geo-alt"></i>
                    {story.location}
                  </p>

                  <blockquote>
                    “{story.story}”
                  </blockquote>

                  <div className="story-heart">
                    <i className="bi bi-heart-fill"></i>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-5">
              <h2>No success stories are available right now.</h2>
              <p className="text-muted mb-0">Please try again shortly.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default SuccessStories;
