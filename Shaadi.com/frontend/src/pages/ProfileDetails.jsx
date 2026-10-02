import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { profiles as profilesApi } from "../services/api";

function ProfileDetails() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestSent, setInterestSent] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profilesApi.getById(id);
        setProfile(data.profile);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-not-found">
        <h1>Profile not found</h1>
        <Link to="/matches">Return to matches</Link>
      </div>
    );
  }

  return (
    <>
      <section className="profile-header-section">
        <Navbar />
      </section>

      <main className="profile-details-page">
        <div className="container">
          <Link className="back-link" to="/matches">
            <i className="bi bi-arrow-left"></i>
            Back to matches
          </Link>

          <div className="profile-details-grid">
            <aside className="profile-photo-panel">
              <div className="profile-main-photo">
                <img src={profile.image} alt={profile.name} />

                <span>
                  <i className="bi bi-patch-check-fill"></i>
                  {profile.isVerified ? "Verified Profile" : "Profile"}
                </span>
              </div>

              <div className="profile-action-grid">
                <button
                  className={`interest-btn ${interestSent ? "is-active" : ""}`}
                  onClick={() => setInterestSent((sent) => !sent)}
                  aria-pressed={interestSent}
                >
                  <i className={`bi ${interestSent ? "bi-heart-fill" : "bi-heart"}`}></i>
                  {interestSent ? "Interest Sent" : "Send Interest"}
                </button>

                <Link className="message-profile-btn" to="/chat">
                  <i className="bi bi-chat-dots"></i>
                  Message
                </Link>
              </div>

              <button
                className={`shortlist-profile-btn ${shortlisted ? "is-active" : ""}`}
                onClick={() => setShortlisted((saved) => !saved)}
                aria-pressed={shortlisted}
              >
                <i className={`bi ${shortlisted ? "bi-bookmark-check-fill" : "bi-bookmark"}`}></i>
                {shortlisted ? "Shortlisted" : "Add to Shortlist"}
              </button>

              {interestSent && <p className="profile-action-feedback">Interest sent successfully</p>}
            </aside>

            <section className="profile-information">
              <div className="profile-title">
                <div>
                  <span>MILAN PROFILE</span>
                  <h1>{profile.name}</h1>

                  <p>
                    {profile.age} years · {profile.city}
                  </p>
                </div>

                <button aria-label="More profile options">
                  <i className="bi bi-three-dots"></i>
                </button>
              </div>

              <div className="profile-info-cards">
                <article>
                  <i className="bi bi-briefcase"></i>
                  <span>Profession</span>
                  <strong>{profile.profession}</strong>
                </article>

                <article>
                  <i className="bi bi-mortarboard"></i>
                  <span>Education</span>
                  <strong>{profile.education}</strong>
                </article>

                <article>
                  <i className="bi bi-geo-alt"></i>
                  <span>Location</span>
                  <strong>{profile.city}</strong>
                </article>

                <article>
                  <i className="bi bi-flower1"></i>
                  <span>Religion</span>
                  <strong>{profile.religion}</strong>
                </article>
              </div>

              <article className="profile-about-card">
                <span>ABOUT ME</span>

                <h2>A little about {profile.name.split(" ")[0]}</h2>

                <p>{profile.about || "I believe meaningful relationships are built through trust, respect and genuine communication. I enjoy travelling, reading and spending time with family. I value personal growth and hope to meet someone with a positive outlook towards life."}</p>
              </article>

              <article className="profile-about-card">
                <span>PARTNER PREFERENCE</span>

                <h2>What I'm looking for</h2>

                <p>{profile.partnerPreference || "I am looking for someone kind, emotionally mature and respectful. A person who values family while also believing in individual dreams and ambitions. Most importantly, I appreciate honesty and open communication."}</p>
              </article>

              <article className="profile-detail-list">
                <h2>Profile details</h2>

                <div>
                  <span>Age</span>
                  <strong>{profile.age} years</strong>
                </div>

                <div>
                  <span>Marital Status</span>
                  <strong>{profile.maritalStatus || "Never Married"}</strong>
                </div>

                <div>
                  <span>Education</span>
                  <strong>{profile.education}</strong>
                </div>

                <div>
                  <span>Profession</span>
                  <strong>{profile.profession}</strong>
                </div>

                <div>
                  <span>City</span>
                  <strong>{profile.city}</strong>
                </div>

                <div>
                  <span>Religion</span>
                  <strong>{profile.religion}</strong>
                </div>
              </article>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProfileDetails;
