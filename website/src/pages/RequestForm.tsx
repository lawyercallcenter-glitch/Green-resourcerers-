import { useState, FormEvent, ChangeEvent } from "react";

interface FormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
}

interface FormErrors {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.address.trim()) errors.address = "Address is required.";
  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!data.description.trim())
    errors.description = "Please describe the satellite equipment.";
  return errors;
}

const initialData: FormData = {
  name: "",
  address: "",
  phone: "",
  email: "",
  description: "",
};

function RequestForm() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      setStatus("success");
      setFormData(initialData);
    } catch (err: unknown) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  if (status === "success") {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
        <h2 style={{ color: "#2e7d32" }}>Request Submitted!</h2>
        <p>Thank you! We will be in touch shortly to schedule your pickup.</p>
        <button
          onClick={() => setStatus("idle")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  const fieldStyle = {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: 4,
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h2>Request Satellite Dish Removal</h2>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Fill out the form below and we will contact you to schedule a pickup.
      </p>

      {status === "error" && (
        <div
          style={{
            padding: "0.75rem",
            marginBottom: "1rem",
            backgroundColor: "#fdecea",
            color: "#b71c1c",
            borderRadius: 4,
          }}
        >
          {serverError || "Something went wrong. Please try again."}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={fieldStyle}
          />
          {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={fieldStyle}
          />
          {errors.address && (
            <small style={{ color: "red" }}>{errors.address}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            style={fieldStyle}
          />
          {errors.phone && (
            <small style={{ color: "red" }}>{errors.phone}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={fieldStyle}
          />
          {errors.email && (
            <small style={{ color: "red" }}>{errors.email}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="description">Description of Satellite Equipment</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            style={fieldStyle}
          />
          {errors.description && (
            <small style={{ color: "red" }}>{errors.description}</small>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: status === "submitting" ? "#999" : "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: "1rem",
            cursor: status === "submitting" ? "not-allowed" : "pointer",
          }}
        >
          {status === "submitting" ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

export default RequestForm;
