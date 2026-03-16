import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Clock, X, Sprout, ChefHat, Recycle, Timer } from 'lucide-react';
import './Home.css';
import './Menu.css';

interface IngredientItem { name: string; amount: string; unit: string; }
interface NutritionItem { label: string; value: string; }
interface Meal {
  name: string; description: string; image: string; time: string; prep: string;
  price: string; category: string; calories: string; difficulty: string;
  serving?: string; ingredients: IngredientItem[] | string[];
  notIncluded?: IngredientItem[]; utensils?: string[]; nutrition: NutritionItem[];
}

function isStructuredIngredient(item: unknown): item is IngredientItem {
  return typeof item === 'object' && item !== null && 'name' in item;
}

function Home() {
  const featuredMeals = useQuery(api.meals.listFeatured);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    if (selectedMeal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedMeal]);

  const renderIngredientGrid = (items: IngredientItem[]) => (
    <div className="modal-ingredient-grid">
      {items.map((item, idx) => (
        <div key={idx} className="modal-ingredient-item">
          <span className="modal-ingredient-name">{item.name}</span>
          <span className="modal-ingredient-amount">{item.amount} {item.unit}</span>
        </div>
      ))}
    </div>
  );

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
  }, [featuredMeals]);

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
            {/* TODO: Replace with your "What is LoopIt" image */}
            <img src="/assets/images/what-LoopIt.png" alt="What is LoopIt" loading="lazy" decoding="async" />
          </div>
          <div className="what-text animate-on-scroll delay-2">
            <h2>What is LoopIt?</h2>
            <p>
              LoopIt is Cambodia's first meal kit delivery service. We bring
              pre-portioned, fresh ingredients and easy-to-follow recipes
              straight to your door — so you can cook delicious homemade meals
              without the hassle of grocery shopping.
            </p>
            <p>
              Whether you're a busy professional, a student, or a family looking
              to eat better, LoopIt makes cooking simple, fun, and waste-free.
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
              <img src="/assets/images/browse_menu.jpg" alt="Browse and choose meals" className="step-img" loading="lazy" decoding="async" />
              <span className="step-number">1</span>
            </div>
            <h3>Choose Your Meals</h3>
            <p>Browse our weekly menu and pick the recipes you love.</p>
          </div>
          <div className="step animate-on-scroll delay-2">
            <div className="step-img-wrapper">
              <img src="/assets/images/deliver.jpg" alt="We deliver to your door" className="step-img" loading="lazy" decoding="async" />
              <span className="step-number">2</span>
            </div>
            <h3>We Deliver</h3>
            <p>Fresh, pre-portioned ingredients arrive at your doorstep.</p>
          </div>
          <div className="step animate-on-scroll delay-3">
            <div className="step-img-wrapper">
              <img src="/assets/images/cook_enjoy.jpg" alt="Cook and enjoy" className="step-img" loading="lazy" decoding="async" />
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
          <h2 className="section-title">Why Choose LoopIt?</h2>
          <p className="section-subtitle">Good food starts with great ingredients and a simple process.</p>
          <span className="section-accent" />
        </div>
        <div className="section-container benefits">
          <div className="benefit-card animate-on-scroll delay-1">
            <div className="benefit-icon-wrapper">
              <Sprout size={36} strokeWidth={1.75} />
            </div>
            <h3>Fresh & Local</h3>
            <p>We source ingredients from local Cambodian farmers and suppliers.</p>
          </div>
          <div className="benefit-card animate-on-scroll delay-2">
            <div className="benefit-icon-wrapper">
              <ChefHat size={36} strokeWidth={1.75} />
            </div>
            <h3>Easy to Cook</h3>
            <p>Step-by-step recipe cards designed for all skill levels.</p>
          </div>
          <div className="benefit-card animate-on-scroll delay-3">
            <div className="benefit-icon-wrapper">
              <Recycle size={36} strokeWidth={1.75} />
            </div>
            <h3>Less Waste</h3>
            <p>Pre-portioned ingredients mean you only get what you need.</p>
          </div>
          <div className="benefit-card animate-on-scroll delay-4">
            <div className="benefit-icon-wrapper">
              <Timer size={36} strokeWidth={1.75} />
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
          {featuredMeals && featuredMeals.length > 0 ? (
            featuredMeals.map((meal, index) => (
              <div key={meal._id} className={`meal-card animate-on-scroll delay-${(index % 4) + 1}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedMeal(meal as unknown as Meal)}>
                <div className="meal-img-wrapper">
                  <img src={meal.image} alt={meal.name} className="meal-img" loading="lazy" decoding="async" />
                  <span className="meal-card-category">{meal.category}</span>
                  {meal.difficulty && (
                    <span className={`meal-card-difficulty ${meal.difficulty.toLowerCase()}`}>{meal.difficulty}</span>
                  )}
                </div>
                <div className="meal-info">
                  <h3>{meal.name}</h3>
                  <p className="meal-desc-truncate">{meal.description}</p>
                  <span className="meal-readmore">Read more</span>
                  <div className="meal-meta">
                    <span className="meal-tag">
                      <Clock size={14} strokeWidth={1.75} />
                      {meal.time}
                    </span>
                    <span className="meal-price">{meal.price}</span>
                  </div>
                </div>
              </div>
            ))
          ) : featuredMeals === undefined ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '2rem 0', gridColumn: '1 / -1' }}>Loading...</p>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '2rem 0', gridColumn: '1 / -1' }}>No featured meals yet.</p>
          )}
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

      {/* MEAL DETAIL MODAL */}
      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMeal(null)} aria-label="Close">
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="modal-img-wrapper">
              <img src={selectedMeal.image} alt={selectedMeal.name} className="modal-img" />
              <div className="modal-img-overlay">
                <h2 className="modal-title">{selectedMeal.name}</h2>
                <p className="modal-subtitle">{selectedMeal.category}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-stats">
                <div className="modal-stat">
                  <span className="modal-stat-label">Total</span>
                  <span className="modal-stat-value">{selectedMeal.time}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Prep</span>
                  <span className="modal-stat-value">{selectedMeal.prep}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Calories</span>
                  <span className="modal-stat-value">{selectedMeal.calories}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Difficulty</span>
                  <span className="modal-stat-value">{selectedMeal.difficulty}</span>
                </div>
              </div>

              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedMeal.description}</p>
              </div>

              {selectedMeal.ingredients && selectedMeal.ingredients.length > 0 && (
                <div className="modal-section">
                  <div className="modal-section-header">
                    <h3>Ingredients</h3>
                    {selectedMeal.serving && (
                      <span className="modal-serving-badge">serving {selectedMeal.serving}</span>
                    )}
                  </div>
                  {isStructuredIngredient(selectedMeal.ingredients[0])
                    ? renderIngredientGrid(selectedMeal.ingredients as IngredientItem[])
                    : (
                      <ul className="modal-ingredients-legacy">
                        {(selectedMeal.ingredients as string[]).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )
                  }
                </div>
              )}

              {selectedMeal.notIncluded && selectedMeal.notIncluded.length > 0 && (
                <div className="modal-section">
                  <h3>Not included in your delivery</h3>
                  {renderIngredientGrid(selectedMeal.notIncluded)}
                </div>
              )}

              {selectedMeal.utensils && selectedMeal.utensils.length > 0 && (
                <div className="modal-section">
                  <h3>Utensils</h3>
                  <div className="modal-utensils">
                    {selectedMeal.utensils.map((u, idx) => (
                      <span key={idx} className="modal-utensil-item">
                        {idx > 0 && <span className="modal-utensil-dot">&bull;</span>}
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMeal.nutrition && selectedMeal.nutrition.length > 0 && (
                <div className="modal-section">
                  <h3>Nutrition Values</h3>
                  <table className="modal-nutrition-table">
                    <thead>
                      <tr>
                        <th>Nutrients</th>
                        <th>per serving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMeal.nutrition.map((n, idx) => (
                        <tr key={n.label} className={idx % 2 === 0 ? 'even' : ''}>
                          <td>{n.label}</td>
                          <td>{n.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="modal-price-row">
                <span className="modal-price">{selectedMeal.price}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
