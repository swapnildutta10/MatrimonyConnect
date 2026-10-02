import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await auth.login(form.email, form.password);
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
    <main className="auth-page">
      <div className="auth-image-panel">
        <Link className="auth-logo" to="/">
          Milan<span>.</span>
        </Link>

        <div className="auth-image-content">
          <span>WELCOME BACK</span>

          <h1>
            Your story may be
            <br />
            one conversation away.
          </h1>

          <p>
            Continue discovering people who share your
            values and vision for the future.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form">
          <div className="auth-heading">
            <span>MEMBER LOGIN</span>

            <h2>Welcome back</h2>

            <p>
              Enter your details to continue to Milan.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Password</label>

                <a href="#">Forgot password?</a>
              </div>

              <div className="input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Milan"}
            </button>
          </form>

          <p className="auth-switch">
            New to Milan?{" "}
            <Link to="/register">
              Create a free profile
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;