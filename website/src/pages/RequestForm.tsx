import { useState, type FormEvent, type ChangeEvent } from 'react'
import './RequestForm.css'

const API_BASE = '/api'

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  dish_count: number
  dish_location: string
  notes: string
}

const INITIAL_FORM: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  dish_count: 1,
  dish_location: '',
  notes: '',
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function RequestForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmationId, setConfirmationId] = useState<number | null>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitState('submitting')
    setErrorMessage('')

    try {
      const res = await fetch(`${API_BASE}/requests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail ?? `Server error: ${res.status}`)
      }
      const created = await res.json()
      setConfirmationId(created.id)
      setSubmitState('success')
      setForm(INITIAL_FORM)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unexpected error. Please try again.')
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <div className="form-page">
        <div className="form-card success-card">
          <div className="success-icon">✅</div>
          <h2>Request Submitted!</h2>
          <p>
            Thank you! Your removal request #{confirmationId} has been received. We'll be in
            touch within 1–2 business days to schedule your appointment.
          </p>
          <button className="btn-primary" onClick={() => setSubmitState('idle')}>
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Schedule Your Free Removal</h1>
        <p className="form-subtitle">
          Fill out the form below and we'll contact you within 1–2 business days.
        </p>

        {submitState === 'error' && (
          <div className="alert alert-error" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                required
                placeholder="Jane"
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                required
                placeholder="Smith"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="jane@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="(555) 555-0001"
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Street Address *</label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="123 Elm Street"
            />
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Springfield"
              />
            </div>
            <div className="form-group form-group-sm">
              <label htmlFor="state">State *</label>
              <input
                id="state"
                name="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                required
                placeholder="IL"
                maxLength={2}
              />
            </div>
            <div className="form-group form-group-sm">
              <label htmlFor="zip_code">ZIP *</label>
              <input
                id="zip_code"
                name="zip_code"
                type="text"
                value={form.zip_code}
                onChange={handleChange}
                required
                placeholder="62701"
                maxLength={10}
              />
            </div>
          </div>

          {/* Dish details */}
          <div className="form-row">
            <div className="form-group form-group-sm">
              <label htmlFor="dish_count">Number of Dishes *</label>
              <input
                id="dish_count"
                name="dish_count"
                type="number"
                min={1}
                max={20}
                value={form.dish_count}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dish_location">Dish Location</label>
              <input
                id="dish_location"
                name="dish_location"
                type="text"
                value={form.dish_location}
                onChange={handleChange}
                placeholder="e.g., Roof — south side"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Anything else we should know — access instructions, old provider, etc."
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-submit"
            disabled={submitState === 'submitting'}
          >
            {submitState === 'submitting' ? 'Submitting…' : 'Submit Request — It\'s Free!'}
          </button>
        </form>
      </div>
    </div>
  )
}
