import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import ProfileCard from "../components/ProfileCard";
import { profiles as profilesApi, auth as authApi } from "../services/api";

const STATS_ICONS = [
  { icon: "bi bi-eye", color: "#a4133c", bg: "#891730" },
  { icon: "bi bi-heart", color: "#e65c4f", bg: "#fef5f3" },
  { icon: "bi bi-chat-heart", color: "#2e7d32", bg: "#edf7ed" },
  { icon: "bi bi-bookmark-heart", color: "#1565c0", bg: "#e3f0ff" },
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [recommendedProfiles, setRecommendedProfiles] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [updatingWishlistId, setUpdatingWishlistId] = useState(null);
  const [stats, setStats] = useState({ profileViews: 0, interestsReceived: 0, conversations: 0, shortlisted: 0 });
  const [greeting, setGreeting] = useState("Good afternoon");
  const [today, setToday] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    setToday(`${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`);

    async function fetchData() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(storedUser);

        const [profilesData, authData, wishlistData] = await Promise.all([
          profilesApi.getAll(),
          authApi.me().catch(() => ({ profile: null })),
          profilesApi.getWishlist().catch(() => ({ wishlist: [] })),
        ]);

        setRecommendedProfiles(profilesData.profiles.slice(0, 3));
        const savedProfileIds = wishlistData.wishlist.map((item) =>
          typeof item.profileId === "object" ? item.profileId._id : item.profileId
        );
        setWishlistIds(new Set(savedProfileIds));

        if (authData.profile) {
          setStats({
            profileViews: authData.profile.profileViews || 0,
            interestsReceived: authData.profile.interestsReceived || 0,
            conversations: 0,
            shortlisted: savedProfileIds.length,
          });
        } else {
          setStats((current) => ({ ...current, shortlisted: savedProfileIds.length }));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }

    fetchData();
  }, []);

  async function handleToggleWishlist(profileId) {
    setUpdatingWishlistId(profileId);
    try {
      const data = await profilesApi.toggleWishlist(profileId);
      setWishlistIds((current) => {
        const next = new Set(current);
        if (data.shortlisted) next.add(profileId);
        else next.delete(profileId);
        return next;
      });
      setStats((current) => ({
        ...current,
        shortlisted: Math.max(0, current.shortlisted + (data.shortlisted ? 1 : -1)),
      }));
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    } finally {
      setUpdatingWishlistId(null);
    }
  }

  const userName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="db-page">
      <DashboardSidebar />

      <main className="db-main">
        {/* HEADER */}
        <header className="db-header">
          <div>
            <span className="db-date">{today}</span>
            <h1>{greeting}, {userName}.</h1>
          </div>
          <div className="db-actions">
            <button className="db-icon-btn" aria-label="Notifications">
              <i className="bi bi-bell"></i>
              <span className="db-dot"></span>
            </button>
            <Link to="/chat" className="db-icon-btn">
              <i className="bi bi-chat-dots"></i>
            </Link>
            <div className="db-avatar">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* WELCOME CARD */}
        <section className="db-welcome">
          <div className="db-welcome-content">
            <span className="db-welcome-tag">YOUR MILAN JOURNEY</span>
            <h2>Your profile is 75% complete</h2>
            <p>Complete your profile to receive more relevant match recommendations.</p>
            <div className="db-progress">
              <div className="db-progress-bar" style={{ width: "75%" }}></div>
            </div>
            <Link to="/register" className="db-welcome-btn">
              <i className="bi bi-pencil-square"></i> Complete My Profile
            </Link>
          </div>
          <div className="db-welcome-icon">
            <i className="bi bi-person-heart"></i>
          </div>
        </section>

        {/* STATS */}
        <section className="db-stats">
          {Object.entries(stats).map(([key, val], i) => {
            const s = STATS_ICONS[i] || STATS_ICONS[0];
            const labels = {
              profileViews: ["Profile Views", "People viewed you"],
              interestsReceived: ["Interests", "Received so far"],
              conversations: ["Conversations", "New messages"],
              shortlisted: ["Shortlisted", "Saved profiles"],
            };
            const [label, desc] = labels[key] || [key, ""];
            return (
              <article key={key} className="db-stat-card" style={{ "--accent": s.color, "--accent-bg": s.bg }}>
                <div className="db-stat-icon" style={{ background: s.bg, color: s.color }}>
                  <i className={s.icon}></i>
                </div>
                <div className="db-stat-body">
                  <strong>{val}</strong>
                  <span>{label}</span>
                  <small>{desc}</small>
                </div>
              </article>
            );
          })}
        </section>

        {/* RECOMMENDATIONS */}
        <section className="db-section">
          <div className="db-section-head">
            <div>
              <span className="db-section-tag">CURATED FOR YOU</span>
              <h2>Today's recommendations</h2>
            </div>
            <Link to="/matches" className="db-section-link">
              View all <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {recommendedProfiles.map((profile) => (
              <div className="col-xl-4 col-md-6" key={profile._id}>
                <ProfileCard
                  profile={profile}
                  isWishlisted={wishlistIds.has(profile._id)}
                  onToggleWishlist={handleToggleWishlist}
                  isUpdatingWishlist={updatingWishlistId === profile._id}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;