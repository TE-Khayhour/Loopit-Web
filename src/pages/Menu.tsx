import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import './Menu.css';

interface IngredientItem {
  name: string;
  amount: string;
  unit: string;
}

interface NutritionItem {
  label: string;
  value: string;
}

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
  serving?: string;
  ingredients: IngredientItem[] | string[];
  notIncluded?: IngredientItem[];
  utensils?: string[];
  nutrition: NutritionItem[];
}

function isStructuredIngredient(item: unknown): item is IngredientItem {
  return typeof item === 'object' && item !== null && 'name' in item;
}

function Menu() {
  const convexMeals = useQuery(api.meals.listPublished);
  const convexCategories = useQuery(api.categories.list);
  const allMeals: Meal[] = convexMeals ?? [];
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryNames = (convexCategories ?? []).map((c) => c.name);
  const meals = activeCategory === 'All' ? allMeals : allMeals.filter((m) => m.category === activeCategory);

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
  }, [meals]);

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

  return (
    <div className="menu-page">

      {/* MENU HERO */}
      <section className="menu-hero">
        <div className="menu-hero-content">
          <span className="menu-hero-badge">Loopit Menu</span>
          <h1>Discover Our Meals</h1>
          <p>Fresh ingredients. Simple recipes. Delivered weekly to your door.</p>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      {categoryNames.length > 0 && (
        <div className="menu-filter-bar">
          <div className="menu-filter-container">
            {['All', ...categoryNames].map((cat) => (
              <button
                key={cat}
                className={`menu-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MEALS GRID */}
      <section className="section menu-section">
        {convexMeals === undefined ? (
          <div className="menu-loading">
            <div className="menu-loading-spinner" />
            <p>Loading menu...</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="menu-empty">
            <p>No meals available yet. Check back soon!</p>
          </div>
        ) : (
        <div>
        <div className="menu-results-bar">
          <span className="menu-results-count">{meals.length} {meals.length === 1 ? 'meal' : 'meals'} found</span>
        </div>
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
                {meal.difficulty && (
                  <span className={`menu-card-difficulty ${meal.difficulty.toLowerCase()}`}>{meal.difficulty}</span>
                )}
              </div>
              <div className="menu-card-body">
                <h3 className="menu-card-name">{meal.name}</h3>
                <p className="menu-card-desc">{meal.description}</p>
                <span
                  className="menu-card-readmore"
                  onClick={(e) => { e.stopPropagation(); setSelectedMeal(meal); }}
                >
                  Read more
                </span>
                <div className="menu-card-meta">
                  {meal.calories && (
                    <span className="menu-card-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.67-6-2.67-6 2 0 4 6 8 6 8s6-4 6-8c0-4.67-4-4.67-6-2z"/></svg>
                      {meal.calories}
                    </span>
                  )}
                  {meal.serving && (
                    <span className="menu-card-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      {meal.serving} serving
                    </span>
                  )}
                </div>
                <div className="menu-card-footer">
                  <span className="menu-card-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {meal.time}
                  </span>
                  <span className="menu-card-price">{meal.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        )}
      </section>

      {/* MEAL DETAIL MODAL */}
      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMeal(null)} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Hero image */}
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

              {/* Not included in delivery */}
              {selectedMeal.notIncluded && selectedMeal.notIncluded.length > 0 && (
                <div className="modal-section">
                  <h3>Not included in your delivery</h3>
                  {renderIngredientGrid(selectedMeal.notIncluded)}
                </div>
              )}

              {/* Utensils */}
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

              {/* Nutrition Values */}
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
                  <p className="modal-nutrition-disclaimer">
                    Due to the different suppliers we purchase our products from, nutritional facts per meal can vary from the website to what is received in the delivered box, depending on your region.
                  </p>
                </div>
              )}

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
