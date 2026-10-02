import { useState, useEffect } from "react";
import { content } from "../services/api";

function DatingTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTips() {
      try {
        const data = await content.getDatingTips();
        setTips(data.tips);
      } catch (err) {
        console.error("Failed to fetch dating tips:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTips();
  }, []);

  return (
    <section className="dating-section">
      <div className="container">
        <div className="section-heading text-center">
          <span>BEFORE THE FIRST MEETING</span>

          <h2>A Few Things Worth Remembering</h2>

          <p>
            Small actions often create the strongest first
            impressions.
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
            {tips.map((tip) => (
              <div className="col-lg-6" key={tip.number}>
                <article className="dating-card">
                  <div className="dating-content">
                    <span className="tip-number">
                      {tip.number}
                    </span>

                    <h3>{tip.title}</h3>

                    <p>{tip.description}</p>
                  </div>

                  <div className="dating-image">
                    <img src={tip.image} alt={tip.title} />
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

export default DatingTips;