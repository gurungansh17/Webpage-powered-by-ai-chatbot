import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, Send } from "lucide-react";
import { submitEnquiry } from "../api";
import toast from "react-hot-toast";
import "./Contact.css";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  country: "",
  jobTitle: "",
  jobDetails: "",
};

const validate = (f) => {
  const e = {};
  if (!f.name.trim()) e.name = "Full name is required.";
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!/^\S+@\S+\.\S+$/.test(f.email))
    e.email = "Please enter a valid email.";
  if (!f.phone.trim()) e.phone = "Phone number is required.";
  if (!f.companyName.trim()) e.companyName = "Company name is required.";
  if (!f.country.trim()) e.country = "Country is required.";
  if (!f.jobTitle.trim()) e.jobTitle = "Job title is required.";
  if (!f.jobDetails.trim()) e.jobDetails = "Please describe your requirements.";
  return e;
};

export default function Contact() {
  const location = useLocation();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.interest) {
      setForm((prev) => ({
        ...prev,
        jobDetails: `Interested in: ${location.state.interest}`,
      }));
    }
  }, [location.state]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await submitEnquiry(form);
      setSuccess(true);
      setForm(EMPTY);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="page-wrapper">
        <div className="container contact-success">
          <CheckCircle size={52} color="var(--cyan)" />
          <h2>Enquiry Received!</h2>
          <p>
            Thank you for getting in touch. A confirmation email has been sent
            to your inbox, and a member of our team will be in touch shortly.
          </p>
          <button className="btn btn-outline" onClick={() => setSuccess(false)}>
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-hero">
          <span className="tag">Get in Touch</span>
          <h1>Tell us about your project</h1>
          <p>
            No account needed. Fill in the form below and we'll get back to you
            within one business day.
          </p>
        </div>

        <div className="contact-layout">
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="form-row">
              <Field
                label="Full Name *"
                name="name"
                value={form.name}
                onChange={change}
                error={errors.name}
                placeholder="Jane Smith"
              />
              <Field
                label="Email Address *"
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                error={errors.email}
                placeholder="jane@company.com"
              />
            </div>
            <div className="form-row">
              <Field
                label="Phone Number *"
                name="phone"
                value={form.phone}
                onChange={change}
                error={errors.phone}
                placeholder="+44 7700 000000"
              />
              <Field
                label="Company Name *"
                name="companyName"
                value={form.companyName}
                onChange={change}
                error={errors.companyName}
                placeholder="Acme Ltd"
              />
            </div>
            <div className="form-row">
              <Field
                label="Country *"
                name="country"
                value={form.country}
                onChange={change}
                error={errors.country}
                placeholder="United Kingdom"
              />
              <Field
                label="Job Title *"
                name="jobTitle"
                value={form.jobTitle}
                onChange={change}
                error={errors.jobTitle}
                placeholder="Head of Digital"
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobDetails">Job Details / Requirements *</label>
              <textarea
                id="jobDetails"
                name="jobDetails"
                value={form.jobDetails}
                onChange={change}
                placeholder="Describe the challenge you're trying to solve and what kind of solution you're looking for…"
                rows={5}
                className={errors.jobDetails ? "input-error" : ""}
              />
              {errors.jobDetails && (
                <span className="field-error">{errors.jobDetails}</span>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                "Submitting…"
              ) : (
                <>
                  <Send size={15} /> Send Enquiry
                </>
              )}
            </button>
          </form>

          <aside className="contact-aside">
            <div className="card">
              <h3>What happens next?</h3>
              <ol className="contact-steps">
                {[
                  "We review your enquiry within 1 business day",
                  "A member of our team contacts you to discuss your needs",
                  "We propose a tailored solution and next steps",
                ].map((step, i) => (
                  <li key={i}>
                    <span>{i + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card">
              <h3>Based in Sunderland, UK</h3>
              <p
                className="muted"
                style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}
              >
                We work with clients globally, with a focus on UK and European
                markets.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
