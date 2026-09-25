import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Zap, Shield, TrendingUp, Star } from 'lucide-react'
import { getSolutions, getCaseStudies, getFeedback } from '../api'
import './Home.css'

/* ─── Particle canvas (signature neural-network element) ─────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = 55
    const pts = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r:  Math.random() * 1.8 + 0.8,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx   = pts[i].x - pts[j].x
          const dy   = pts[i].y - pts[j].y
          const dist = Math.hypot(dx, dy)
          if (dist < 115) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0,212,255,${0.13 * (1 - dist / 115)})`
            ctx.lineWidth   = 0.7
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,212,255,0.55)'
        ctx.fill()
        pts[i].x += pts[i].vx
        pts[i].y += pts[i].vy
        if (pts[i].x < 0 || pts[i].x > canvas.width)  pts[i].vx *= -1
        if (pts[i].y < 0 || pts[i].y > canvas.height) pts[i].vy *= -1
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" />
}

/* ─── Star rating ──────────────────────────────────────────────────────────── */
function Stars({ n }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= n ? '#00D4FF' : 'none'} color={i <= n ? '#00D4FF' : '#4A5568'} />
      ))}
    </div>
  )
}

export default function Home() {
  const [solutions,   setSolutions]   = useState([])
  const [caseStudies, setCaseStudies] = useState([])
  const [feedback,    setFeedback]    = useState([])

  useEffect(() => {
    getSolutions().then(r  => setSolutions(r.data.slice(0, 3))).catch(() => {})
    getCaseStudies().then(r => setCaseStudies(r.data.slice(0, 3))).catch(() => {})
    getFeedback().then(r   => setFeedback(r.data.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <ParticleCanvas />
        <div className="container hero__content">
          <span className="tag">AI-Powered Solutions</span>
          <h1>Accelerating the Future<br />of <span className="cyan">Digital Work</span></h1>
          <p className="hero__sub">
            AI-Solutions builds intelligent software that helps industries move faster,
            resolve issues proactively, and unlock the full potential of their teams.
          </p>
          <div className="hero__ctas">
            <Link to="/contact" className="btn btn-primary">Start a Project <ArrowRight size={15} /></Link>
            <Link to="/solutions" className="btn btn-outline">Our Solutions</Link>
          </div>
          <div className="hero__stats">
            {[['50+','Projects Delivered'],['12+','Industries Served'],['98%','Client Satisfaction']].map(([v,l]) => (
              <div key={l}>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Why section */}
      <section className="section">
        <div className="container">
          <span className="tag">Why Choose Us</span>
          <h2 style={{ marginBottom: '2rem' }}>AI that works for your people</h2>
          <div className="grid-2">
            {[
              { icon: <Brain size={22} />, title: 'AI-First Approach', text: 'Every solution is built with intelligence at its core, not bolted on as an afterthought.' },
              { icon: <Zap size={22} />, title: 'Rapid Prototyping', text: 'We move from concept to working prototype faster than any traditional agency.' },
              { icon: <Shield size={22} />, title: 'Secure by Design', text: 'Enterprise-grade security and data privacy built into every product we ship.' },
              { icon: <TrendingUp size={22} />, title: 'Measurable Impact', text: 'We track outcomes. Every engagement comes with clear metrics and reporting.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="card card-hover why__card">
                <div className="why__icon">{icon}</div>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Solutions preview */}
      {solutions.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="tag">What We Build</span>
            <div className="section-header">
              <h2>Our Solutions</h2>
              <Link to="/solutions" className="btn btn-outline btn-sm">View All <ArrowRight size={13} /></Link>
            </div>
            <div className="grid-3">
              {solutions.map(s => (
                <div key={s._id} className="card card-hover sol-card">
                  <div className="sol-dot" />
                  <h3>{s.title}</h3>
                  <p className="muted">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* Case studies preview */}
      {caseStudies.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="tag">Past Work</span>
            <div className="section-header">
              <h2>Real Results, Real Industries</h2>
              <Link to="/case-studies" className="btn btn-outline btn-sm">View All <ArrowRight size={13} /></Link>
            </div>
            <div className="grid-3">
              {caseStudies.map(cs => (
                <div key={cs._id} className="card card-hover cs-card">
                  <span className="badge badge-industry">{cs.industry}</span>
                  <h3>{cs.title}</h3>
                  <p className="muted">{cs.summary.substring(0, 110)}…</p>
                  {cs.outcome && <p className="cs-outcome">✦ {cs.outcome}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* Testimonials */}
      {feedback.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="tag">Client Feedback</span>
            <h2 style={{ marginBottom: '2rem' }}>What our clients say</h2>
            <div className="grid-3">
              {feedback.map(f => (
                <div key={f._id} className="card card-hover testimonial">
                  <Stars n={f.rating} />
                  <p className="testimonial__quote">"{f.comment}"</p>
                  <div className="testimonial__author">
                    <strong>{f.customerName}</strong>
                    {f.companyName && <span className="muted">{f.companyName}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* CTA */}
      <section className="section cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Ready to transform your digital workplace?</h2>
            <p className="muted" style={{ marginTop: '0.5rem' }}>Tell us about your challenge. We'll build something exceptional.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  )
}
