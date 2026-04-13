import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const INITIAL = { homeowner_name: '', address: '', phone: '', email: '', notes: '' };

export default function App() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm(INITIAL);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <span>🌿</span>
        <h1>The Green Resourcerers</h1>
      </header>

      <main>
        <section className="hero">
          <h2>Satellite Dish Removal &amp; Recycling</h2>
          <p>We remove obsolete satellite dishes from your property — for free or low cost — and recycle the materials responsibly.</p>
        </section>

        <section>
          <h2>Request a Removal</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="homeowner_name"
              placeholder="Full Name *"
              value={form.homeowner_name}
              onChange={handleChange}
              required
            />
            <input
              name="address"
              placeholder="Property Address *"
              value={form.address}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone Number *"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={handleChange}
            />
            <textarea
              name="notes"
              placeholder="Additional notes (dish location, access info, etc.)"
              value={form.notes}
              onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
            {status === 'success' && (
              <p className="success">✅ Request submitted! We'll be in touch soon.</p>
            )}
            {status === 'error' && (
              <p className="error">❌ Something went wrong. Please try again or call us directly.</p>
            )}
          </form>
        </section>

        <section>
          <h2>Why Choose Us?</h2>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8' }}>
            <li>Free or low-cost removal for qualifying homeowners</li>
            <li>Environmentally responsible recycling</li>
            <li>Licensed, insured, and safety-certified technicians</li>
            <li>Fast scheduling and clean job completion</li>
          </ul>
        </section>
      </main>

      <footer>
        &copy; {new Date().getFullYear()} The Green Resourcerers LLC. All rights reserved.
      </footer>
    </>
  );
}
