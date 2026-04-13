import { Link } from "react-router-dom";

const steps = [
  { title: "Request", description: "Submit a service request online." },
  { title: "Schedule", description: "We coordinate a convenient pickup time." },
  { title: "Removal", description: "Our team safely removes your satellite equipment." },
  { title: "Recycling", description: "Materials are responsibly recycled and precious metals recovered." },
];

function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#2e7d32" }}>
          The Green Resourcerers LLC
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#555" }}>
          Satellite Dish Removal &amp; Environmental Recycling
        </p>
      </section>

      {/* Services */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Our Services</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Satellite Dish Removal</strong> — Safe, professional
            removal of residential and commercial satellite equipment.
          </li>
          <li>
            <strong>Precious Metal Recovery</strong> — We extract and reclaim
            valuable metals from electronic components.
          </li>
          <li>
            <strong>Environmental Recycling</strong> — All materials are
            processed through eco-friendly recycling channels, keeping waste
            out of landfills.
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <Link
          to="/request"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "#2e7d32",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: "1.1rem",
          }}
        >
          Request a Pickup
        </Link>
      </section>

      {/* How It Works */}
      <section>
        <h2>How It Works</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#2e7d32",
                }}
              >
                {i + 1}
              </div>
              <h3>{step.title}</h3>
              <p style={{ color: "#555" }}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
