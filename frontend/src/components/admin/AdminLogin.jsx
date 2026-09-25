import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { Zap, LogIn } from 'lucide-react'
import { loginAdmin } from '../../api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './Admin.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const captchaRef = useRef(null)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const captchaToken = captchaRef.current?.getValue()
    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA verification.')
      return
    }
    setLoading(true)
    try {
      const res = await loginAdmin({ username, password, captchaToken })
      login(res.data.token, res.data.admin)
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please try again.')
      captchaRef.current?.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <Zap size={26} />
          AI-Solutions
        </div>
        <h2>Admin Panel</h2>
        <p>Sign in to manage website content and enquiries.</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="admin-login__captcha">
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
              theme="dark"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Signing in…' : <><LogIn size={15} /> Sign In</>}
          </button>
        </form>
      </div>
    </div>
  )
}
