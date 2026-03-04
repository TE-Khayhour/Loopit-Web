import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import './Menu.css';

interface Meal {
  name: string;
  description: string;
  image: string;
  time: string;
  prep: string;
  price: string;
  category: string;
  calories: string;
  difficulty: string;
  ingredients: string[];
  nutrition: { label: string; value: string }[];
}

function Menu() {
  const convexMeals = useQuery(api.meals.listPublished);
  const meals: Meal[] = convexMeals ?? [];
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedMeal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedMeal]);

  return (
    <div className="menu-page">

      {/* ======================== */}
      {/* MENU HERO                */}
      {/* ======================== */}
      <section className="menu-hero">
        <h1>Our Menu</h1>
        <p>Fresh ingredients. Simple recipes. Delivered weekly.</p>
      </section>

      {/* ======================== */}
      {/* MEALS GRID               */}
      {/* ======================== */}
      <section className="section menu-section">
        {convexMeals === undefined ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '3rem 0' }}>Loading menu...</p>
        ) : meals.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '3rem 0' }}>No meals available yet. Check back soon!</p>
        ) : (
        <div className="menu-grid-container">
          {meals.map((meal, index) => (
            <div
              key={meal.name}
              className={`menu-card animate-on-scroll delay-${(index % 4) + 1}`}
              onClick={() => setSelectedMeal(meal)}
            >
              <div className="menu-card-img-wrapper">
                <img src={meal.image} alt={meal.name} className="menu-card-img" />
                <span className="menu-card-category">{meal.category}</span>
              </div>
              <div className="menu-card-body">
                <h3 className="menu-card-name">{meal.name}</h3>
                <p className="menu-card-desc">{meal.description}</p>
                <div className="menu-card-footer">
                  <span className="menu-card-time">{meal.time}</span>
                  <span className="menu-card-price">{meal.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* ======================== */}
      {/* MEAL DETAIL MODAL        */}
      {/* ======================== */}
      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMeal(null)} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal image with name overlay */}
            <div className="modal-img-wrapper">
              <img src={selectedMeal.image} alt={selectedMeal.name} className="modal-img" />
              <div className="modal-img-overlay">
                <h2 className="modal-title">{selectedMeal.name}</h2>
                <p className="modal-subtitle">{selectedMeal.category}</p>
              </div>
            </div>

            <div className="modal-body">
              {/* Quick stats */}
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

              {/* Description */}
              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedMeal.description}</p>
              </div>

              {/* Ingredients */}
              <div className="modal-section">
                <h3>Ingredients</h3>
                <ul className="modal-ingredients">
                  {selectedMeal.ingredients.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Nutrition Facts */}
              <div className="modal-section">
                <h3>Nutrition Facts</h3>
                <div className="modal-nutrition">
                  {selectedMeal.nutrition.map((n) => (
                    <div key={n.label} className="modal-nutrition-item">
                      <span className="modal-nutrition-value">{n.value}</span>
                      <span className="modal-nutrition-label">{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
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

export default Menu;
