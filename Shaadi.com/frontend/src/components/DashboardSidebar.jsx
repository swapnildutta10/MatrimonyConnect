import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { auth } from "../services/api";

const navItems = [
  { to: "/dashboard", icon: "bi bi-grid-fill", label: "Dashboard" },
  { to: "/matches", icon: "bi bi-people-fill", label: "Matches" },
  { to: "/chat", icon: "bi bi-chat-dots-fill", label: "Messages" },
  { to: "/chat/history", icon: "bi bi-clock-history", label: "Chat History" },
  { to: "/success-stories", icon: "bi bi-heart-fill", label: "Success Stories" },
  { to: "/pricing", icon: "bi bi-star-fill", label: "Membership" },
  { to: "/profile/edit", icon: "bi bi-person-fill", label: "My Profile" },
];

function DashboardSidebar() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [membership, setMembership] = useState("Free");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(stored);

    auth.me()
      .then((data) => {
        if (data.profile?.membership) {
          setMembership(data.profile.membership);
        }
      })
      .catch(() => {});
  }, []);

  function handleLogout() {
    if (!window.confirm("Do you want to log out of Milan?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.assign("/login");
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Toggle button for mobile */}
      <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
      </button>

      {/* Brand */}
      <div className="sidebar-brand">
        <Link to="/">
          <i className="bi bi-heart-fill brand-heart"></i>
          <span>Milan<span className="brand-dot">.</span></span>
        </Link>
        <span className="sidebar-brand-badge">MATRIMONY</span>
      </div>

      {/* User Profile */}
      <div className="sidebar-profile-card">
        <div className="sidebar-avatar">
          {initial}
        </div>
        <div className="sidebar-user-info">
          <strong>{user?.name || "User"}</strong>
          <span>
            <i className="bi bi-star-fill"></i> {membership}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">MAIN MENU</span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-user">
          <div className="sidebar-footer-avatar">{initial}</div>
          <div className="sidebar-footer-info">
            <strong>{user?.name || "User"}</strong>
            <span>{user?.email || ""}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;