import { Link } from 'react-router-dom'
import './Home.css'

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Submit a Request',
    description:
      'Fill out our simple online form with your address and dish details. It takes less than 2 minutes.',
    icon: '📋',
  },
  {
    step: '2',
    title: 'We Schedule a Visit',
    description:
      'Our team reviews your request and schedules a certified technician at a time that works for you.',
    icon: '📅',
  },
  {
    step: '3',
    title: 'Free Professional Removal',
    description:
      'A trained technician safely removes your satellite dish — no mess, no cost to you.',
    icon: '🔧',
  },
  {
    step: '4',
    title: 'Responsible Recycling',
    description:
      'We recover precious metals and recycle all materials through certified environmental channels.',
    icon: '♻️',
  },
]

const BENEFITS = [
  { icon: '💰', title: '100% Free', body: 'No charge to homeowners — ever.' },
  {
    icon: '🌿',
    title: 'Eco-Friendly',
    body: 'Materials are recycled, not landfilled.',
  },
  {
    icon: '🏠',
    title: 'Property Value',
    body: 'Remove eyesores and improve curb appeal.',
  },
  {
    icon: '✅',
    title: 'Certified Pros',
    body: 'Licensed, insured technicians handle every job.',
  },
]

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            Free Satellite Dish Removal<br />
            <span className="hero-accent">for Homeowners</span>
          </h1>
          <p className="hero-subtitle">
            Got an old satellite dish rusting on your roof or in your yard?
            The Green Resourcerers will remove it for <strong>free</strong> — and
            responsibly recycle every piece.
          </p>
          <Link to="/request" className="hero-cta">
            Schedule My Free Removal
          </Link>
        </div>
        <div className="hero-graphic" aria-hidden="true">🛰️</div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="step-card">
                <div className="step-icon">{item.icon}</div>
                <div className="step-num">Step {item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-body">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section section-alt">
        <div className="section-inner">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="benefits-grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <h2>Ready to reclaim your roof?</h2>
          <p>Submit a request today — we'll handle the rest.</p>
          <Link to="/request" className="hero-cta">
            Get Started — It's Free
          </Link>
        </div>
      </section>
    </div>
  )
}
