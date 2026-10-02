import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="container hero-content">
      <div className="row justify-content-center text-center">
        <div className="col-lg-9">
          <p className="hero-tagline">
            TRUSTED MATRIMONIAL PLATFORM
          </p>

          <h1>
            Where meaningful
            <br />
            connections <span>begin.</span>
          </h1>

          <p className="hero-description">
            Discover genuine profiles and meet someone who shares
            your values, dreams, and vision for the future.
          </p>
        </div>
      </div>

      <div className="search-box">
        <div className="row g-3 align-items-end">
          <div className="col-lg-3 col-md-6">
            <label>I'm looking for</label>

            <select className="form-select">
              <option>Woman</option>
              <option>Man</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-6">
            <label>Age</label>

            <select className="form-select">
              <option>21 - 25 years</option>
              <option>26 - 30 years</option>
              <option>31 - 35 years</option>
              <option>36 - 40 years</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-6">
            <label>Religion</label>

            <select className="form-select">
              <option>Select religion</option>
              <option>Hindu</option>
              <option>Muslim</option>
              <option>Christian</option>
              <option>Sikh</option>
              <option>Buddhist</option>
              <option>Jain</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-6">
            <Link to="/matches" className="search-btn">
              <i className="bi bi-search"></i>
              Find Matches
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <strong>2M+</strong>
          <span>Genuine Profiles</span>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <strong>50K+</strong>
          <span>Success Stories</span>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <strong>100%</strong>
          <span>Privacy Focused</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;