import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    popular: false,
    description: "Begin exploring Milan.",
  },
  {
    name: "Milan Plus",
    price: "₹999",
    period: "/ 3 months",
    popular: true,
    description: "For meaningful conversations.",
  },
  {
    name: "Milan Premium",
    price: "₹1,799",
    period: "/ 6 months",
    popular: false,
    description: "Our complete matchmaking experience.",
  },
];

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "bi bi-phone" },
  { id: "card", label: "Card", icon: "bi bi-credit-card" },
  { id: "netbanking", label: "Net Banking", icon: "bi bi-bank" },
  { id: "wallet", label: "Wallet", icon: "bi bi-wallet2" },
];

const banks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Yes Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
];

function Payment() {
  const { planName } = useParams();
  const navigate = useNavigate();
  const plan = plans.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === planName
  );

  const [method, setMethod] = useState("upi");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  function fmt(field, value) {
    let v = value;
    if (field === "number") v = value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
    if (field === "expiry") v = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);
    if (field === "cvv") v = value.replace(/\D/g, "").slice(0, 4);
    setCard((p) => ({ ...p, [field]: v }));
  }

  function submit(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDone(true);
    }, 2000);
  }

  if (!plan) {
    return (
      <div className="pay-page">
        <Navbar />
        <div className="pay-body">
          <div className="pay-card text-center py-5">
            <i className="bi bi-exclamation-triangle" style={{ fontSize: "3rem", color: "#dc3545" }}></i>
            <h4 className="mt-3">Plan not found</h4>
            <button className="pay-btn mt-3" onClick={() => navigate("/pricing")}>← Back to Plans</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (done) {
    return (
      <div className="pay-page">
        <Navbar />
        <div className="pay-body">
          <div className="pay-card text-center py-5" style={{ maxWidth: 520, margin: "0 auto" }}>
            <div className="pay-check">
              <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none" stroke="#22c55e" strokeWidth="4" /><path fill="none" stroke="#22c55e" strokeWidth="4" d="M14 27l7 7 16-16" /></svg>
            </div>
            <h3 className="mt-4 fw-bold">Payment Successful!</h3>
            <p className="text-muted">Your <strong>{plan.name}</strong> plan is now active.</p>
            <div className="pay-receipt">
              <span>Amount Paid</span>
              <strong>{plan.price} {plan.period}</strong>
            </div>
            <button className="pay-btn mt-4" onClick={() => navigate("/pricing")}>← Back to Plans</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pay-page">
      <Navbar />

      <div className="pay-hero">
        <div className="container">
          <span className="pay-hero-tag">SECURE CHECKOUT</span>
          <h1>Complete payment</h1>
          <p>Choose your preferred method to activate your plan.</p>
        </div>
      </div>

      <div className="pay-body">
        <div className="container">
          <div className="pay-layout">
            {/* LEFT — Plan Summary */}
            <div className="pay-sidebar">
              <div className="pay-plan-card">
                <span className="pay-side-label">Selected Plan</span>
                <h2>{plan.name}</h2>
                {plan.popular && <span className="pay-popular">POPULAR</span>}
                <p>{plan.description}</p>

                <div className="pay-divider"></div>

                <div className="pay-price-row">
                  <span>Amount</span>
                  <strong>{plan.price} <small>{plan.period}</small></strong>
                </div>
                <div className="pay-price-row">
                  <span>Tax</span>
                  <strong>₹0 <small>incl.</small></strong>
                </div>

                <div className="pay-divider"></div>

                <div className="pay-total-row">
                  <span>Total</span>
                  <strong>{plan.price} <small>{plan.period}</small></strong>
                </div>

                <button className="pay-back-btn" onClick={() => navigate("/pricing")}>
                  <i className="bi bi-arrow-left"></i> Change Plan
                </button>
              </div>

              <div className="pay-badge">
                <i className="bi bi-shield-check"></i>
                <div>
                  <strong>SSL Secure</strong>
                  <span>256-bit encrypted</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Payment Form */}
            <div className="pay-main">
              <div className="pay-method-tabs">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    className={`pay-tab ${method === m.id ? "active" : ""}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <i className={m.icon}></i>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="pay-form">
                {/* UPI */}
                {method === "upi" && (
                  <div className="pay-fields">
                    <div className="pay-upi-grid">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map((a) => (
                        <button
                          key={a}
                          type="button"
                          className={`pay-upi-btn ${upiId === a ? "selected" : ""}`}
                          onClick={() => setUpiId(a)}
                        >
                          <i className="bi bi-phone"></i>
                          <span>{a}</span>
                        </button>
                      ))}
                    </div>
                    <div className="pay-divider-text"><span>OR</span></div>
                    <div className="pay-field">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        placeholder="username@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Card */}
                {method === "card" && (
                  <div className="pay-fields">
                    <div className="pay-card-preview">
                      <i className="bi bi-credit-card-2-front"></i>
                      <span>{card.number || "•••• •••• •••• ••••"}</span>
                    </div>
                    <div className="pay-field">
                      <label>Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={(e) => fmt("number", e.target.value)}
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="pay-field">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={card.name}
                        onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="pay-row">
                      <div className="pay-field">
                        <label>Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={card.expiry}
                          onChange={(e) => fmt("expiry", e.target.value)}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="pay-field">
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="•••"
                          value={card.cvv}
                          onChange={(e) => fmt("cvv", e.target.value)}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {method === "netbanking" && (
                  <div className="pay-fields">
                    <div className="pay-field">
                      <label>Select Bank</label>
                      <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} required>
                        <option value="">— Choose your bank —</option>
                        {banks.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="pay-bank-chips">
                      {banks.map((b) => (
                        <span
                          key={b}
                          className={`pay-chip ${selectedBank === b ? "active" : ""}`}
                          onClick={() => setSelectedBank(b)}
                        >
                          <i className="bi bi-bank2"></i> {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wallet */}
                {method === "wallet" && (
                  <div className="pay-fields">
                    <div className="pay-upi-grid">
                      {[
                        { name: "Paytm Wallet", icon: "bi bi-wallet2" },
                        { name: "Amazon Pay", icon: "bi bi-wallet2" },
                        { name: "Mobikwik", icon: "bi bi-wallet2" },
                        { name: "Freecharge", icon: "bi bi-wallet2" },
                      ].map((w) => (
                        <button
                          key={w.name}
                          type="button"
                          className={`pay-upi-btn ${selectedBank === w.name ? "selected" : ""}`}
                          onClick={() => setSelectedBank(w.name)}
                        >
                          <i className={w.icon}></i>
                          <span>{w.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="pay-submit" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="pay-spinner"></span> Processing…
                    </>
                  ) : (
                    <>
                      Pay {plan.price} <i className="bi bi-lock-fill"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Payment;