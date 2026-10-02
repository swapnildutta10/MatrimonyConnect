import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { auth, content } from "../services/api";

const TIERS = [
  { name: "Free", icon: "bi bi-rocket-takeoff" },
  { name: "Milan Plus", icon: "bi bi-lightning-fill" },
  { name: "Milan Premium", icon: "bi bi-gem" },
];

function Pricing() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMembership, setCurrentMembership] = useState("");
  const [user, setUser] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const [data, account] = await Promise.all([
          content.getPricingPlans(),
          auth.me().catch(() => ({ user: null, profile: null })),
        ]);
        setPlans(data.plans);
        setCurrentMembership(account.profile?.membership || "");
        setUser(account.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  function choosePlan(planName) {
    if (!user) { navigate("/login"); return; }
    if (planName === currentMembership) {
      setMessage(`You're already on ${planName}`);
      return;
    }
    const slug = planName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/payment/${slug}`);
  }

  if (loading) {
    return (
      <div className="px-page">
        <Navbar />
        <div className="px-hero">
          <div className="container">
            <span className="px-tag">MEMBERSHIP</span>
            <h1>Choose your journey</h1>
            <p>Simple plans designed to help you make meaningful connections.</p>
          </div>
        </div>
        <div className="px-body">
          <div className="container text-center py-5">
            <div className="px-spinner"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="px-page">
      <Navbar />
      <div className="px-hero">
        <div className="container">
          <span className="px-tag">MEMBERSHIP</span>
          <h1>Choose your journey</h1>
          <p>Simple plans designed to help you make meaningful connections.</p>
        </div>
      </div>

      <div className="px-body">
        <div className="container">
          {message && (
            <div className="px-toast" onClick={() => setMessage("")}>
              <i className="bi bi-info-circle"></i> {message}
            </div>
          )}

          <div className="px-grid">
            {plans.map((plan, i) => {
              const tier = TIERS[i] || TIERS[0];
              const isCurrent = plan.name === currentMembership;
              const isHover = hovered === plan.name;

              return (
                <div
                  key={plan.name}
                  className={`px-card px-card-${i} ${plan.popular ? "px-popular" : ""} ${isCurrent ? "px-current" : ""} ${!isCurrent ? "px-clickable" : ""}`}
                  onMouseEnter={() => !isCurrent && setHovered(plan.name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => !isCurrent && choosePlan(plan.name)}
                >
                  {plan.popular && <span className="px-popular-badge">Most Popular</span>}

                  <div className="px-icon-wrap">
                    <i className={tier.icon}></i>
                  </div>

                  <h3 className="px-name">{plan.name}</h3>
                  <p className="px-desc">{plan.description}</p>

                  <div className="px-price">
                    {plan.price}
                    <small>{plan.period}</small>
                  </div>

                  {isCurrent && <div className="px-current-label">✓ Current Plan</div>}

                  <ul className="px-features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a4133c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="px-btn"
                    onClick={(e) => { e.stopPropagation(); choosePlan(plan.name); }}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current Plan" : `Choose ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Pricing;