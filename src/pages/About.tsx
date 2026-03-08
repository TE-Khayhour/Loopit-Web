import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const values = [
  {
    icon: '/assets/icons/recipe.png',
    title: 'Reliable Recipes',
    desc: 'Committed to affordable, time-saving meals that fit any lifestyle and budget.',
  },
  {
    icon: '/assets/icons/farm_fresh_ingredients.png',
    title: 'Farm-Fresh Ingredients',
    desc: 'Peak produce, from farm to fridge.',
  },
  {
    icon: '/assets/icons/possiblities.png',
    title: 'Delicious Possibilities',
    desc: 'Unlocking delicious, new meal possibilities with a vast chef-crafted menu.',
  },
  {
    icon: '/assets/icons/sustainable.png',
    title: 'Sustainable Solutions',
    desc: 'Reducing food waste and ensuring CO2-offset deliveries for your box.',
  },
  {
    icon: '/assets/icons/meaningful.png',
    title: 'Meaningful Moments',
    desc: 'Helping each other bond over joyful cooking moments and homemade meals.',
  },
];

const mealKitFeatures = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ),
    title: 'Pre-Portioned',
    desc: 'Exact ingredients for each recipe — no measuring, no leftovers.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    title: 'Ready in 30 Min',
    desc: 'Most meals can be prepared in under 30 minutes with simple steps.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ),
    title: 'Step-by-Step',
    desc: 'Easy-to-follow recipe cards included with every delivery.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    title: 'Delivered Fresh',
    desc: 'Weekly delivery straight to your door across Phnom Penh.',
  },
];

const teamMembers = [
  { name: 'LEK Seang Hong', role: 'Founder', image: '/assets/images/Team_Members/LEK_Seang_Hong(Founder).jpg' },
  { name: 'TE Khay Hour', role: 'Co-Founder', image: '/assets/images/Team_Members/TE_Khay_Hour (Co-Founder).jpg' },
  { name: 'TAING Muyleang', role: 'Co-Founder', image: '/assets/images/Team_Members/TAING_Muyleang (Co-Founder).jpg' },
  { name: 'PONLORK Ponita', role: 'Co-Founder', image: '/assets/images/Team_Members/PONLORK_Ponita (Co-Founder).jpg' },
  { name: 'HENG Kiman', role: 'Co-Founder', image: '/assets/images/Team_Members/HENG_Kiman (Co-Founder).jpg' },
];

function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">

      {/* ========== HERO ========== */}
      <section className="about-hero" style={{ backgroundImage: "url('/assets/images/aboutus_hero.png')" }}>
        <div className="about-hero-overlay">
          <h1>Cambodia's <span>#1 Meal Kit</span></h1>
        </div>
      </section>

      {/* ========== OUR VALUES ========== */}
      <section id="our-values" className="about-section about-values">
        <div className="about-section-header fade-up">
          <h2>Our Values</h2>
        </div>
        <div className="about-values-grid">
          {values.map((v, i) => (
            <div key={v.title} className="about-value-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="about-value-icon">
                <img src={v.icon} alt={v.title} />
              </div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== OUR MEAL KITS ========== */}
      <section id="our-meal-kits" className="about-section about-mealkits">
        <div className="about-mealkits-inner">
          <div className="about-mealkits-img fade-up">
            <img src="/assets/images/meal_kit.png" alt="Loopit Meal Kit" />
          </div>
          <div className="about-mealkits-content fade-up" style={{ transitionDelay: '0.15s' }}>
            <h2>Our Meal Kits</h2>
            <p>
              Every Loopit box is packed with pre-portioned, farm-fresh ingredients and an easy-to-follow recipe card. 
              No planning, no grocery runs — just great food on your table in minutes.
            </p>
            <div className="about-mealkits-features">
              {mealKitFeatures.map((f) => (
                <div key={f.title} className="about-mealkit-feature">
                  <span className="about-mealkit-feature-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== MEET OUR TEAM ========== */}
      <section id="meet-our-team" className="about-section about-team">
        <div className="about-section-header fade-up">
          <h2>Meet Our Team</h2>
          <p>The passionate people behind Loopit.</p>
        </div>
        <div className="about-team-photos fade-up">
          <div className="about-team-photo">
            <img src="/assets/images/team_photo.jpg" alt="Loopit Team" />
          </div>
          <div className="about-team-photo">
            <img src="/assets/images/team_pic.JPG" alt="Loopit Team" />
          </div>
        </div>
        <div className="about-team-grid">
          {teamMembers.map((m, i) => (
            <div key={m.name} className="about-team-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="about-team-img">
                <img src={m.image} alt={m.name} />
              </div>
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section id="partner-with-us" className="about-cta" style={{ backgroundImage: "url('/assets/images/about_cta.jpg')" }}>
        <div className="about-cta-overlay">
          <div className="about-cta-block fade-up">
            <h2>Ready to Cook Something Amazing?</h2>
            <p>
              Fresh ingredients. Simple recipes. Delivered to your door.
              <br />
              Start your meal-kit journey today — dinner has never been this easy.
            </p>
            <Link to="/menu" className="about-cta-btn primary">Explore Our Menu</Link>
          </div>
          <div className="about-cta-divider" />
          <div className="about-cta-block fade-up" style={{ transitionDelay: '0.15s' }}>
            <h2>Interested in Partnering With Us?</h2>
            <p>
              Whether you're a supplier, restaurant, or brand — we'd love to collaborate.
              <br />
              Let's grow together and bring great food to more homes across Cambodia.
            </p>
            <Link to="/contact" className="about-cta-btn secondary">Get in Touch</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
