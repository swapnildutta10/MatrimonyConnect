import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    profileCreatedFor: "Myself",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        profileCreatedFor: form.profileCreatedFor,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <div className="container">
        <Link className="register-logo" to="/">
          Milan<span>.</span>
        </Link>

        <div className="register-container">
          <div className="register-heading text-center">
            <span>BEGIN YOUR JOURNEY</span>

            <h1>Create your Milan profile</h1>

            <p>
              Tell us a little about yourself and start
              discovering meaningful connections.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-section-title">
                <span>01</span>

                <div>
                  <h3>Basic Information</h3>
                  <p>Let's start with the essentials.</p>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label>Profile Created For</label>

                  <select
                    className="form-select"
                    value={form.profileCreatedFor}
                    onChange={(e) => setForm({ ...form, profileCreatedFor: e.target.value })}
                  >
                    <option>Myself</option>
                    <option>Son</option>
                    <option>Daughter</option>
                    <option>Brother</option>
                    <option>Sister</option>
                    <option>Friend</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Full Name</label>

                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Email</label>

                  <input
                    className="form-control"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Mobile Number</label>

                  <input
                    className="form-control"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">
                <span>02</span>

                <div>
                  <h3>Secure Your Account</h3>
                  <p>Create your login password.</p>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label>Password</label>

                  <input
                    className="form-control"
                    type="password"
                    placeholder="Create password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="col-md-6">
                  <label>Confirm Password</label>

                  <input
                    className="form-control"
                    type="password"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Profile..." : "Create My Profile"}
              {!loading && <i className="bi bi-arrow-right"></i>}
            </button>

            <p className="auth-switch">
              Already a member?{" "}
              <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;