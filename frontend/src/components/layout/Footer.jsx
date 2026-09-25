import { Link } from 'react-router-dom'
import { Zap, Mail, MapPin, Globe, ExternalLink } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">

        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <Zap size={18} /> AI-Solutions
          </Link>
          <p>Innovating the future of the digital employee experience through AI-powered software solutions.</p>
          <div className="footer__social">
            <a href="#!" aria-label="LinkedIn"><Globe size={17} /></a>
            <a href="#!" aria-label="Twitter"><ExternalLink size={17} /></a>
            <a href="#!" aria-label="GitHub"><ExternalLink size={17} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/solutions">Solutions</Link></li>
            <li><Link to="/case-studies">Past Work</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <ul>
            <li><Mail size={13} /> hello@ai-solutions.co.uk</li>
            <li><MapPin size={13} /> Sunderland, UK</li>
            <li><Link to="/contact">Send an Enquiry →</Link></li>
          </ul>
        </div>

      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} AI-Solutions. All rights reserved.</p>
          <Link to="/admin/login" className="footer__admin-link">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
