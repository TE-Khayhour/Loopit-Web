import { useEffect, useState } from 'react';
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

const meals: Meal[] = [
  {
    name: 'Beef Lok Lak',
    description: 'Tender stir-fried beef tossed in a savory pepper-lime sauce, served over fresh greens with steamed rice.',
    image: '/assets/images/meals/BeefLokLak.jpg',
    time: '~25 min',
    prep: '10 min',
    price: '$6.99',
    category: 'Cambodian',
    calories: '620 kcal',
    difficulty: 'Easy',
    ingredients: ['Beef sirloin', 'Jasmine rice', 'Lettuce', 'Tomato', 'Onion', 'Lime', 'Black pepper', 'Soy sauce', 'Oyster sauce'],
    nutrition: [{ label: 'Calories', value: '620 kcal' }, { label: 'Protein', value: '38g' }, { label: 'Carbs', value: '52g' }, { label: 'Fat', value: '22g' }],
  },
  {
    name: 'Korean Bibimbap',
    description: 'A colorful bowl of warm rice topped with seasoned vegetables, egg, and spicy gochujang sauce.',
    image: '/assets/images/meals/bibimbapl.jpg',
    time: '~30 min',
    prep: '15 min',
    price: '$7.49',
    category: 'Korean',
    calories: '710 kcal',
    difficulty: 'Medium',
    ingredients: ['Short-grain rice', 'Egg', 'Carrot', 'Spinach', 'Zucchini', 'Bean sprouts', 'Sesame oil', 'Gochujang paste', 'Sesame seeds'],
    nutrition: [{ label: 'Calories', value: '710 kcal' }, { label: 'Protein', value: '28g' }, { label: 'Carbs', value: '85g' }, { label: 'Fat', value: '24g' }],
  },
  {
    name: 'Malatang Hot Pot',
    description: 'A rich, spicy broth loaded with fresh vegetables, noodles, and your choice of protein.',
    image: '/assets/images/meals/malatangjpg.jpg',
    time: '~20 min',
    prep: '10 min',
    price: '$7.99',
    category: 'Chinese',
    calories: '580 kcal',
    difficulty: 'Easy',
    ingredients: ['Glass noodles', 'Bok choy', 'Mushrooms', 'Tofu', 'Corn', 'Chili paste', 'Sichuan peppercorn', 'Garlic', 'Ginger'],
    nutrition: [{ label: 'Calories', value: '580 kcal' }, { label: 'Protein', value: '22g' }, { label: 'Carbs', value: '68g' }, { label: 'Fat', value: '18g' }],
  },
  {
    name: 'Chocolate Brownie Cake',
    description: 'Fudgy, rich chocolate brownie baked to perfection — a sweet treat to end any meal.',
    image: '/assets/images/meals/Brownie-Cake.png',
    time: '~35 min',
    prep: '10 min',
    price: '$4.99',
    category: 'Dessert',
    calories: '480 kcal',
    difficulty: 'Easy',
    ingredients: ['Dark chocolate', 'Butter', 'Sugar', 'Eggs', 'Flour', 'Cocoa powder', 'Vanilla extract', 'Salt'],
    nutrition: [{ label: 'Calories', value: '480 kcal' }, { label: 'Protein', value: '6g' }, { label: 'Carbs', value: '58g' }, { label: 'Fat', value: '26g' }],
  },
];

function Menu() {
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
