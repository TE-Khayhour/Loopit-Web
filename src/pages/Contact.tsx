import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Phone, Mail, MapPin } from 'lucide-react';
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
          <h2 className="contact-company">LoopIt Cambodia</h2>
          <p className="contact-subtitle">Meal Kit Delivery Service, Phnom Penh, Cambodia</p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <span className="contact-detail-icon">
                <Phone size={20} strokeWidth={1.75} />
              </span>
              <div>
                <strong>TEL</strong>
                <p>+855 11 211 251</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <span className="contact-detail-icon">
                <Mail size={20} strokeWidth={1.75} />
              </span>
              <div>
                <strong>EMAIL</strong>
                <p><a href="mailto:loopit2026@gmail.com">loopit2026@gmail.com</a></p>
              </div>
            </div>

            <div className="contact-detail-item">
              <span className="contact-detail-icon">
                <MapPin size={20} strokeWidth={1.75} />
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
