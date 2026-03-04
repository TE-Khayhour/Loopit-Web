import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">

      {/* ======================== */}
      {/* HERO SECTION             */}
      {/* TODO: Set your hero background image in Home.css (.hero) */}
      {/* ======================== */}
      <section id="hero" className="hero">
        <div className="hero-overlay">
          <span className="hero-badge">Cambodia's First Meal Kit</span>
          <h1 className="hero-title">
            {/* TODO: Replace with your slogan */}
            Make Cooking Easier,
            <br />Healthier & More Fun!
          </h1>
          <p className="hero-subtitle">
            We source ingredients, recipes & step-by-step instructions.
            <br />All ready for you to just cook and enjoy!
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-white">
              View Our Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* WHAT IS LOOPIT?          */}
      {/* ======================== */}
      <section id="what-is-loopit" className="section what-is-loopit">
        <div className="section-container two-col">
          <div className="what-image animate-on-scroll">
            {/* TODO: Replace with your "What is Loopit" image */}
            <img src="/assets/images/what-LoopIt.png" alt="What is Loopit" />
          </div>
          <div className="what-text animate-on-scroll delay-2">
            <h2>What is Loopit?</h2>
            <p>
              Loopit is Cambodia's first meal kit delivery service. We bring
              pre-portioned, fresh ingredients and easy-to-follow recipes
              straight to your door — so you can cook delicious homemade meals
              without the hassle of grocery shopping.
            </p>
            <p>
              Whether you're a busy professional, a student, or a family looking
              to eat better, Loopit makes cooking simple, fun, and waste-free.
            </p>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* HOW IT WORKS             */}
      {/* ======================== */}
      <section id="how-it-works" className="section how-it-works">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to a delicious home-cooked meal.</p>
          <span className="section-accent" />
        </div>
        <div className="section-container steps">
          <div className="step animate-on-scroll delay-1">
            <div className="step-img-wrapper">
              <img src="/assets/images/browse_menu.jpg" alt="Browse and choose meals" className="step-img" />
              <span className="step-number">1</span>
            </div>
            <h3>Choose Your Meals</h3>
            <p>Browse our weekly menu and pick the recipes you love.</p>
          </div>
          <div className="step animate-on-scroll delay-2">
            <div className="step-img-wrapper">
              <img src="/assets/images/deliver.jpg" alt="We deliver to your door" className="step-img" />
              <span className="step-number">2</span>
            </div>
            <h3>We Deliver</h3>
            <p>Fresh, pre-portioned ingredients arrive at your doorstep.</p>
          </div>
          <div className="step animate-on-scroll delay-3">
            <div className="step-img-wrapper">
              <img src="/assets/images/cook_enjoy.jpg" alt="Cook and enjoy" className="step-img" />
              <span className="step-number">3</span>
            </div>
            <h3>Cook & Enjoy</h3>
            <p>Follow our simple recipe cards and enjoy a homemade meal in under 30 minutes.</p>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* WHY CHOOSE LOOPIT?       */}
      {/* ======================== */}
      <section id="why-loopit" className="section why-loopit">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Why Choose Loopit?</h2>
          <p className="section-subtitle">Good food starts with great ingredients and a simple process.</p>
          <span className="section-accent" />
        </div>
        <div className="section-container benefits">
          <div className="benefit-card animate-on-scroll delay-1">
            <div className="benefit-icon-wrapper">
              <img src="/assets/icons/fresh_local.png" alt="Fresh & Local" className="benefit-icon" />
            </div>
            <h3>Fresh & Local</h3>
            <p>We source ingredients from local Cambodian farmers and suppliers.</p>
          </div>
          <div className="benefit-card animate-on-scroll delay-2">
            <div className="benefit-icon-wrapper">
              <img src="/assets/icons/ez_cook.png" alt="Easy to Cook" className="benefit-icon" />
            </div>
            <h3>Easy to Cook</h3>
            <p>Step-by-step recipe cards designed for all skill levels.</p>
          </div>
          <div className="benefit-card animate-on-scroll delay-3">
            <div className="benefit-icon-wrapper">
              <img src="/assets/icons/less_waste.png" alt="Less Waste" className="benefit-icon" />
            </div>
            <h3>Less Waste</h3>
            <p>Pre-portioned ingredients mean you only get what you need.</p>
          </div>
          <div className="benefit-card animate-on-scroll delay-4">
            <div className="benefit-icon-wrapper">
              <img src="/assets/icons/save_time.png" alt="Save Time" className="benefit-icon" />
            </div>
            <h3>Save Time</h3>
            <p>No planning, no shopping — just cook and enjoy.</p>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* FEATURED MEALS            */}
      {/* ======================== */}
      <section id="featured-meals" className="section featured-meals">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Featured Meals</h2>
          <p className="section-subtitle">Explore some of our most-loved dishes this week.</p>
          <span className="section-accent" />
        </div>
        <div className="section-container meals-grid">
          <div className="meal-card animate-on-scroll delay-1">
            <div className="meal-img-wrapper">
              <img src="/assets/images/meals/BeefLokLak.jpg" alt="Beef Lok Lak" className="meal-img" />
            </div>
            <div className="meal-info">
              <h3>Beef Lok Lak</h3>
              <p>Tender stir-fried beef tossed in a savory pepper-lime sauce, served over fresh greens with steamed rice.</p>
              <div className="meal-meta">
                <span className="meal-tag">~25 min</span>
                <span className="meal-price">$6.99</span>
              </div>
            </div>
          </div>
          <div className="meal-card animate-on-scroll delay-2">
            <div className="meal-img-wrapper">
              <img src="/assets/images/meals/bibimbapl.jpg" alt="Korean Bibimbap" className="meal-img" />
            </div>
            <div className="meal-info">
              <h3>Korean Bibimbap</h3>
              <p>A colorful bowl of warm rice topped with seasoned vegetables, egg, and spicy gochujang sauce.</p>
              <div className="meal-meta">
                <span className="meal-tag">~30 min</span>
                <span className="meal-price">$7.49</span>
              </div>
            </div>
          </div>
          <div className="meal-card animate-on-scroll delay-3">
            <div className="meal-img-wrapper">
              <img src="/assets/images/meals/malatangjpg.jpg" alt="Malatang Hot Pot" className="meal-img" />
            </div>
            <div className="meal-info">
              <h3>Malatang Hot Pot</h3>
              <p>A rich, spicy broth loaded with fresh vegetables, noodles, and your choice of protein.</p>
              <div className="meal-meta">
                <span className="meal-tag">~20 min</span>
                <span className="meal-price">$7.99</span>
              </div>
            </div>
          </div>
          <div className="meal-card animate-on-scroll delay-4">
            <div className="meal-img-wrapper">
              <img src="/assets/images/meals/Brownie-Cake.png" alt="Chocolate Brownie Cake" className="meal-img" />
            </div>
            <div className="meal-info">
              <h3>Chocolate Brownie Cake</h3>
              <p>Fudgy, rich chocolate brownie baked to perfection — a sweet treat to end any meal.</p>
              <div className="meal-meta">
                <span className="meal-tag">~35 min</span>
                <span className="meal-price">$4.99</span>
              </div>
            </div>
          </div>
        </div>
        <div className="meals-cta animate-on-scroll">
          <Link to="/menu" className="btn btn-primary">View More Menu</Link>
        </div>
      </section>

      {/* ======================== */}
      {/* FINAL CTA                */}
      {/* Background image: /assets/images/final-cta.png */}
      {/* ======================== */}
      <section className="final-cta">
        <div className="final-cta-content animate-on-scroll">
          <h2>
            Delicious. Healthy.
            <br />Ready For Your Kitchen.
          </h2>
          <p>Tasty meals made simple, so healthy habits stick.</p>
          <Link to="/menu" className="btn btn-primary">
            View Our Menu
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
