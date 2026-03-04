import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import './AdminDashboard.css';

interface MealForm {
  name: string;
  description: string;
  image: string;
  time: string;
  prep: string;
  price: string;
  category: string;
  calories: string;
  difficulty: string;
  ingredients: string;
  nutrition: string;
  published: boolean;
}

const emptyForm: MealForm = {
  name: '',
  description: '',
  image: '',
  time: '',
  prep: '',
  price: '',
  category: '',
  calories: '',
  difficulty: 'Easy',
  ingredients: '',
  nutrition: 'Calories:0 kcal,Protein:0g,Carbs:0g,Fat:0g',
  published: false,
};

function AdminDashboard() {
  const navigate = useNavigate();
  const meals = useQuery(api.meals.listAll);
  const createMeal = useMutation(api.meals.create);
  const updateMeal = useMutation(api.meals.update);
  const togglePublished = useMutation(api.meals.togglePublished);
  const removeMeal = useMutation(api.meals.remove);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"meals"> | null>(null);
  const [form, setForm] = useState<MealForm>(emptyForm);

  const handleLogout = () => {
    sessionStorage.removeItem('loopit-admin');
    navigate('/admin');
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (meal: NonNullable<typeof meals>[number]) => {
    setEditingId(meal._id);
    setForm({
      name: meal.name,
      description: meal.description,
      image: meal.image,
      time: meal.time,
      prep: meal.prep,
      price: meal.price,
      category: meal.category,
      calories: meal.calories,
      difficulty: meal.difficulty,
      ingredients: meal.ingredients.join(', '),
      nutrition: meal.nutrition.map((n) => `${n.label}:${n.value}`).join(','),
      published: meal.published,
    });
    setShowForm(true);
  };

  const parseNutrition = (raw: string) => {
    return raw.split(',').map((item) => {
      const [label, value] = item.split(':').map((s) => s.trim());
      return { label: label || '', value: value || '' };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      image: form.image,
      time: form.time,
      prep: form.prep,
      price: form.price,
      category: form.category,
      calories: form.calories,
      difficulty: form.difficulty,
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      nutrition: parseNutrition(form.nutrition),
      published: form.published,
    };

    if (editingId) {
      await updateMeal({ id: editingId, ...payload });
    } else {
      await createMeal(payload);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: Id<"meals">) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      await removeMeal({ id });
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <img src="/assets/images/android-chrome-192x192.png" alt="Loopit" className="admin-header-logo" />
          <h1>Loopit Admin</h1>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="admin-main">
        <div className="admin-toolbar">
          <h2>Menu Management</h2>
          <button className="admin-add-btn" onClick={openCreate}>+ Add Meal</button>
        </div>

        {/* Meals table */}
        {meals === undefined ? (
          <p className="admin-loading">Loading meals...</p>
        ) : meals.length === 0 ? (
          <p className="admin-empty">No meals yet. Click "Add Meal" to create one.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal._id}>
                    <td>
                      <img src={meal.image} alt={meal.name} className="admin-table-img" />
                    </td>
                    <td className="admin-table-name">{meal.name}</td>
                    <td>{meal.category}</td>
                    <td>{meal.price}</td>
                    <td>{meal.time}</td>
                    <td>
                      <button
                        className={`admin-status-badge ${meal.published ? 'published' : 'draft'}`}
                        onClick={() => togglePublished({ id: meal._id })}
                      >
                        {meal.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn edit" onClick={() => openEdit(meal)}>Edit</button>
                        <button className="admin-action-btn delete" onClick={() => handleDelete(meal._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingId ? 'Edit Meal' : 'Add New Meal'}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-meal-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
              </div>
              <div className="admin-form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/assets/images/meals/example.jpg" required />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$6.99" required />
                </div>
                <div className="admin-form-group">
                  <label>Total Time</label>
                  <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="~25 min" required />
                </div>
                <div className="admin-form-group">
                  <label>Prep Time</label>
                  <input value={form.prep} onChange={(e) => setForm({ ...form, prep: e.target.value })} placeholder="10 min" required />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Calories</label>
                  <input value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="620 kcal" required />
                </div>
                <div className="admin-form-group">
                  <label>Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Ingredients (comma-separated)</label>
                <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder="Beef, Rice, Lettuce, Lime" required />
              </div>
              <div className="admin-form-group">
                <label>Nutrition (label:value, comma-separated)</label>
                <input value={form.nutrition} onChange={(e) => setForm({ ...form, nutrition: e.target.value })} placeholder="Calories:620 kcal,Protein:38g,Carbs:52g,Fat:22g" required />
              </div>
              <div className="admin-form-check">
                <label>
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  Publish immediately
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-save-btn">{editingId ? 'Save Changes' : 'Create Meal'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
