import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <section className="inner-hero about-hero">
        <Navbar />

        <div className="container text-center inner-hero-content">
          <span>OUR PURPOSE</span>

          <h1>More than a match.</h1>

          <p>
            Milan is designed around genuine introductions,
            thoughtful conversations and meaningful relationships.
          </p>
        </div>
      </section>

      <section className="about-intro-section">
        <div className="container">
          <div className="about-intro-grid">
            <div className="about-intro-content">
              <span>WHY MILAN</span>

              <h2>
                Technology should help people connect, not make
                relationships feel mechanical.
              </h2>

              <p>
                Milan began with a simple idea: finding a life
                partner should feel personal, respectful and safe.
                Profiles are more than a collection of filters.
                Behind every profile is a person with aspirations,
                values and a unique story.
              </p>

              <p>
                Our platform is designed to encourage meaningful
                discovery while giving members control over their
                privacy and interactions.
              </p>
            </div>

            <div className="about-intro-image">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                alt="People connecting"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="section-heading text-center">
            <span>WHAT GUIDES US</span>
            <h2>Built around human values</h2>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <article className="value-card">
                <i className="bi bi-shield-check"></i>
                <h3>Trust First</h3>
                <p>
                  Privacy, transparency and responsible interactions
                  form the foundation of the Milan experience.
                </p>
              </article>
            </div>

            <div className="col-lg-4">
              <article className="value-card">
                <i className="bi bi-chat-heart"></i>
                <h3>Genuine Conversations</h3>
                <p>
                  We design experiences that encourage people to
                  understand each other beyond basic profile data.
                </p>
              </article>
            </div>

            <div className="col-lg-4">
              <article className="value-card">
                <i className="bi bi-people"></i>
                <h3>Respect Always</h3>
                <p>
                  Every member deserves control, dignity and respect
                  throughout their matchmaking journey.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container text-center">
          <span>YOUR STORY IS YOURS</span>

          <h2>Perhaps it begins here.</h2>

          <Link to="/register">
            Create Your Profile
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;