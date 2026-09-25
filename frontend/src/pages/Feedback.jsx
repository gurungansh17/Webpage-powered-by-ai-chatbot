import { useEffect, useState } from 'react'
import { Star, CheckCircle, Send } from 'lucide-react'
import { getFeedback, submitFeedback } from '../api'
import toast from 'react-hot-toast'
import './Feedback.css'

/* ─── Star picker ─────────────────────────────────────────────────────────── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="star-picker" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn${n <= (hovered || value) ? ' active' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star size={28} fill={n <= (hovered || value) ? '#00D4FF' : 'none'} />
        </button>
      ))}
    </div>
  )
}

/* ─── Display stars (read-only) ───────────────────────────────────────────── */
function Stars({ n }) {
  return (
    <div className="stars-display">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          fill={i <= n ? '#00D4FF' : 'none'}
          color={i <= n ? '#00D4FF' : '#4A5568'}
        />
      ))}
    </div>
  )
}

const EMPTY = { customerName: '', companyName: '', rating: 0, comment: '' }

export default function Feedback() {
  const [feedback, setFeedback] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState(EMPTY)
  const [errors,   setErrors]   = useState({})
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    getFeedback()
      .then(r => setFeedback(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.customerName.trim()) e.customerName = 'Your name is required.'
    if (form.rating === 0)         e.rating       = 'Please select a star rating.'
    if (!form.comment.trim())      e.comment      = 'Please write a comment.'
    else if (form.comment.length > 500) e.comment = 'Comment cannot exceed 500 characters.'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      await submitFeedback(form)
      setSuccess(true)
      setForm(EMPTY)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-hero">
          <span className="tag">Client Feedback</span>
          <h1>What our clients say</h1>
          <p>Read reviews from organisations we've worked with, and share your own experience.</p>
        </div>

        <div className="feedback-layout">

          {/* ─── Left: approved feedback ─────────────────────────── */}
          <div className="feedback-list-col">
            <h2 className="feedback-col-title">Reviews</h2>
            {loading ? (
              <div className="spinner" />
            ) : feedback.length === 0 ? (
              <div className="state-box" style={{ textAlign: 'left', padding: '2rem 0' }}>
                <h3>No reviews yet</h3>
                <p>Be the first to leave feedback below.</p>
              </div>
            ) : (
              <div className="feedback-cards">
                {feedback.map(f => (
                  <div key={f._id} className="card feedback-card">
                    <Stars n={f.rating} />
                    <p className="feedback-comment">"{f.comment}"</p>
                    <div className="feedback-author">
                      <strong>{f.customerName}</strong>
                      {f.companyName && <span className="muted">{f.companyName}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: submit form ───────────────────────────────── */}
          <div className="feedback-form-col">
            <div className="card">
              <h2 className="feedback-col-title">Leave a Review</h2>
              <p className="muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Your feedback will be reviewed before it appears publicly.
              </p>

              {success ? (
                <div className="feedback-success">
                  <CheckCircle size={40} color="var(--cyan)" />
                  <h3>Thank you!</h3>
                  <p>Your feedback has been submitted and will appear after review.</p>
                  <button className="btn btn-outline" onClick={() => setSuccess(false)}>
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="feedback-form">
                  <div className="form-group">
                    <label htmlFor="customerName">Your Name *</label>
                    <input
                      id="customerName"
                      name="customerName"
                      value={form.customerName}
                      onChange={change}
                      placeholder="Jane Smith"
                      className={errors.customerName ? 'input-error' : ''}
                    />
                    {errors.customerName && <span className="field-error">{errors.customerName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyName">Company Name <span className="muted">(optional)</span></label>
                    <input
                      id="companyName"
                      name="companyName"
                      value={form.companyName}
                      onChange={change}
                      placeholder="Acme Ltd"
                    />
                  </div>

                  <div className="form-group">
                    <label>Star Rating *</label>
                    <StarPicker
                      value={form.rating}
                      onChange={n => {
                        setForm({ ...form, rating: n })
                        if (errors.rating) setErrors({ ...errors, rating: '' })
                      }}
                    />
                    {errors.rating && <span className="field-error">{errors.rating}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">
                      Your Comment *{' '}
                      <span className="muted" style={{ fontWeight: 400 }}>
                        ({form.comment.length}/500)
                      </span>
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={form.comment}
                      onChange={change}
                      placeholder="Tell us about your experience working with AI-Solutions…"
                      rows={4}
                      className={errors.comment ? 'input-error' : ''}
                    />
                    {errors.comment && <span className="field-error">{errors.comment}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Submitting…' : <><Send size={14} /> Submit Review</>}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
