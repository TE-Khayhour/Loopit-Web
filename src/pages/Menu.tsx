import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Flame, Users, Clock, X, LayoutGrid, CakeSlice, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CN from 'country-flag-icons/react/3x2/CN';
import KH from 'country-flag-icons/react/3x2/KH';
import KR from 'country-flag-icons/react/3x2/KR';
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
  _id: any;
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
  const allMeals: Meal[] = (convexMeals as any) ?? [];
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  
  const { items, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

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
    if (selectedMeal || showCartDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedMeal, showCartDrawer]);

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
          <span className="menu-hero-badge">LoopIt Menu</span>
          <h1>Discover Our Meals</h1>
          <p>Fresh ingredients. Simple recipes. Delivered weekly to your door.</p>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      {categoryNames.length > 0 && (
        <div className="menu-filter-bar">
          <div className="menu-filter-container">
            {['All', ...categoryNames].map((cat) => {
              const iconMap: Record<string, React.ReactNode> = {
                All: <LayoutGrid size={16} strokeWidth={1.75} />,
                Chinese: <CN title="China" className="menu-filter-flag" />,
                Khmer: <KH title="Cambodia" className="menu-filter-flag" />,
                Korean: <KR title="South Korea" className="menu-filter-flag" />,
                Baking: <CakeSlice size={16} strokeWidth={1.75} />,
              };
              return (
                <button
                  key={cat}
                  className={`menu-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {iconMap[cat] || null}
                  {cat}
                </button>
              );
            })}
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
                <img src={meal.image} alt={meal.name} className="menu-card-img" loading="lazy" decoding="async" />
                <span className="menu-card-category">{meal.category}</span>
                {meal.difficulty && (
                  <span className={`menu-card-difficulty ${meal.difficulty.toLowerCase()}`}>{meal.difficulty}</span>
                )}
              </div>
              <div className="menu-card-body">
                <h3 className="menu-card-name">{meal.name}</h3>
                <p className="menu-card-desc">{meal.description}</p>
                <div className="menu-card-actions">
                  <span
                    className="menu-card-readmore"
                    onClick={(e) => { e.stopPropagation(); setSelectedMeal(meal); }}
                  >
                    Read more
                  </span>
                  <button 
                    className="add-to-cart-btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        mealId: meal._id,
                        name: meal.name,
                        price: meal.price,
                        image: meal.image
                      });
                    }}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <div className="menu-card-meta">
                  {meal.calories && (
                    <span className="menu-card-meta-item">
                      <Flame size={14} strokeWidth={1.75} />
                      {meal.calories}
                    </span>
                  )}
                  {meal.serving && (
                    <span className="menu-card-meta-item">
                      <Users size={14} strokeWidth={1.75} />
                      {meal.serving} serving
                    </span>
                  )}
                </div>
                <div className="menu-card-footer">
                  <span className="menu-card-time">
                    <Clock size={14} strokeWidth={1.75} />
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

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button className="floating-cart-btn" onClick={() => setShowCartDrawer(true)}>
          <ShoppingCart size={24} />
          <span className="cart-badge">{totalItems}</span>
        </button>
      )}

      {/* Cart Drawer Overlay */}
      {showCartDrawer && (
        <div className="cart-drawer-overlay" onClick={() => setShowCartDrawer(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h3>Your Cart</h3>
              <button onClick={() => setShowCartDrawer(false)}><X size={24} /></button>
            </div>
            
            <div className="cart-drawer-content">
              {items.length === 0 ? (
                <div className="empty-cart-msg">
                  <ShoppingCart size={48} />
                  <p>Your cart is empty</p>
                  <button className="start-shopping-btn" onClick={() => setShowCartDrawer(false)}>Start Shopping</button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {items.map((item) => (
                    <div key={item.mealId} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>{item.price}</p>
                        <div className="cart-item-qty">
                          <button onClick={() => updateQuantity(item.mealId, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.mealId, item.quantity + 1)}><Plus size={14} /></button>
                          <button className="remove-item-btn" onClick={() => removeFromCart(item.mealId)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-total-row">
                  <span>Total</span>
                  <span>{totalPrice}</span>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={() => {
                    setShowCartDrawer(false);
                    navigate('/checkout');
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEAL DETAIL MODAL */}
      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMeal(null)} aria-label="Close">
              <X size={20} strokeWidth={2.5} />
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

              {/* Price and Add to Cart */}
              <div className="modal-price-row">
                <span className="modal-price">{selectedMeal.price}</span>
                <button 
                  className="modal-add-to-cart-btn"
                  onClick={() => {
                    addToCart({
                      mealId: selectedMeal._id,
                      name: selectedMeal.name,
                      price: selectedMeal.price,
                      image: selectedMeal.image
                    });
                    setSelectedMeal(null);
                    setShowCartDrawer(true);
                  }}
                >
                  <Plus size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Menu;
