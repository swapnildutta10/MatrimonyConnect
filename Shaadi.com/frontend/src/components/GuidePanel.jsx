import { useState, useEffect } from "react";
import { content } from "../services/api";

function GuidePanel() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const data = await content.getArticles();
        setGuides(data.articles);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  return (
    <section className="guide-section">
      <div className="container">
        <div className="section-heading text-center">
          <span>MILAN JOURNAL</span>

          <h2>Relationships, Love & Meaningful Connections</h2>

          <p>
            Thoughtful guides to help you build genuine and lasting
            relationships.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {guides.map((guide) => (
              <div className="col-lg-4 col-md-6" key={guide.id}>
                <article className="guide-card">
                  <div className="guide-image">
                    <img src={guide.image} alt={guide.title} />

                    <span className="guide-category">
                      {guide.category}
                    </span>
                  </div>

                  <div className="guide-content">
                    <h3>{guide.title}</h3>

                    <p>{guide.description}</p>

                    <button className="read-more-btn">
                      Read Article
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GuidePanel;