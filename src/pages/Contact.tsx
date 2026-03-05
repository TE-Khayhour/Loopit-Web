import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const EMAILJS_SERVICE_ID = 'service_j9m5wvd';
const EMAILJS_TEMPLATE_ID = 'template_pl2h08q';
const EMAILJS_PUBLIC_KEY = 'qRrY1b3qqu0VeevBv';

function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setSubmitted(true);
    } catch {
      setError('Failed to send message. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1>Contact Us</h1>
      </section>

      <section className="contact-content">
        {/* Left column — company info */}
        <div className="contact-info">
          <h2 className="contact-company">Loopit Cambodia</h2>
          <p className="contact-subtitle">Meal Kit Delivery Service, Phnom Penh, Cambodia</p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <span className="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <div>
                <strong>TEL</strong>
                <p>+855 11 211 251</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <span className="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <div>
                <strong>EMAIL</strong>
                <p><a href="mailto:loopit2026@gmail.com">loopit2026@gmail.com</a></p>
              </div>
            </div>

            <div className="contact-detail-item">
              <span className="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <div>
                <strong>LOCATION</strong>
                <p>Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — contact form */}
        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="contact-success">
              <h3>Thank you!</h3>
              <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
              <button className="contact-reset-btn" onClick={() => { setSubmitted(false); setForm({ firstName: '', lastName: '', email: '', phone: '', message: '', agreed: false }); }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-field">
                  <label>* First Name</label>
                  <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
                </div>
                <div className="contact-field">
                  <label>* Last Name</label>
                  <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label>* E-mail Address</label>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                </div>
                <div className="contact-field">
                  <label>* Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                </div>
              </div>

              <div className="contact-field">
                <label>Send Us a Message</label>
                <textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={6} required />
              </div>

              <div className="contact-agree">
                <input type="checkbox" id="contact-agree-check" checked={form.agreed} onChange={(e) => update('agreed', e.target.checked)} required />
                <label htmlFor="contact-agree-check">
                  * By submitting this form, you acknowledge that you intend to sign this form electronically and that your electronic signature is the equivalent of a handwritten signature. <a href="mailto:loopit2026@gmail.com">Read our privacy policy</a>.
                </label>
              </div>

              {error && <p className="contact-error">{error}</p>}

              <div className="contact-form-actions">
                <button type="submit" className="contact-submit-btn" disabled={sending}>
                  {sending ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default Contact;
