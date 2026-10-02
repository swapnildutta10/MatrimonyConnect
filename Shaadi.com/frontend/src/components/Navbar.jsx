import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const { pathname } = useLocation();
  const [showRouteAnimation, setShowRouteAnimation] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    setShowRouteAnimation(true);
    const timer = window.setTimeout(() => setShowRouteAnimation(false), 650);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const navLinkClass = ({ isActive }) => [
    "nav-link",
    isActive ? "active" : "",
    isActive && showRouteAnimation ? "nav-link-route-change" : "",
  ].filter(Boolean).join(" ");

  function handleLogout() {
    if (!window.confirm("Do you want to log out of Milan?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.assign("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg milan-navbar">
      <div className="container">
        <Link className="navbar-brand milan-logo" to="/">
          Milan<span>.</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list"></i>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/" end>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={navLinkClass} to="/matches">
                Matches
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                to="/success-stories"
              >
                Success Stories
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={navLinkClass} to="/pricing">
                Plans
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={navLinkClass} to="/about">
                About
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item ms-lg-3">
                  <Link className="login-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item ms-lg-3">
                  <button type="button" className="register-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-3">
                  <Link className="login-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item ms-lg-3">
                  <Link className="register-btn" to="/register">
                    Register Free
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
