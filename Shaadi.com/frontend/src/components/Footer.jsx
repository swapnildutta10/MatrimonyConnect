import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="milan-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <Link className="footer-logo" to="/">
              Milan<span>.</span>
            </Link>

            <p className="footer-description">
              Meaningful connections begin with genuine
              conversations. Discover people who share your
              values, dreams and vision for the future.
            </p>

            <div className="footer-socials">
              <button aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </button>

              <button aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </button>

              <button aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </button>

              <button aria-label="Youtube">
                <i className="bi bi-youtube"></i>
              </button>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h4>Explore</h4>

            <Link to="/matches">Matches</Link>
            <Link to="/success-stories">
              Success Stories
            </Link>
            <Link to="/pricing">Membership</Link>
          </div>

          <div className="col-6 col-lg-2">
            <h4>Company</h4>

            <Link to="/about">About</Link>
            <Link to="/">Safety</Link>
            <Link to="/">Help Center</Link>
          </div>

          <div className="col-lg-4">
            <h4>Begin Your Story</h4>

            <p className="footer-small">
              Create your profile and discover meaningful
              connections.
            </p>

            <Link
              className="footer-register-btn"
              to="/register"
            >
              Create Free Profile
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Milan. Demo matrimonial platform.</p>

          <div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;