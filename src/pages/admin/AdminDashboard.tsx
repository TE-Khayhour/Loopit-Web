import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import './AdminDashboard.css';

interface IngredientRow {
  name: string;
  amount: string;
  unit: string;
}

interface NutritionRow {
  label: string;
  value: string;
}

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
  serving: string;
  allergens: string;
  ingredients: IngredientRow[];
  notIncluded: IngredientRow[];
  utensils: string[];
  nutrition: NutritionRow[];
  published: boolean;
}

const defaultNutrition: NutritionRow[] = [
  { label: 'Calories', value: '' },
  { label: 'Fat', value: '' },
  { label: 'Saturated Fat', value: '' },
  { label: 'Carbohydrate', value: '' },
  { label: 'Sugar', value: '' },
  { label: 'Dietary Fiber', value: '' },
  { label: 'Protein', value: '' },
  { label: 'Cholesterol', value: '' },
  { label: 'Sodium', value: '' },
];

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
  serving: '',
  allergens: '',
  ingredients: [{ name: '', amount: '', unit: '' }],
  notIncluded: [{ name: '', amount: '', unit: '' }],
  utensils: [''],
  nutrition: defaultNutrition.map((n) => ({ ...n })),
  published: false,
};

function AdminDashboard() {
  const navigate = useNavigate();
  const meals = useQuery(api.meals.listAll);
  const createMeal = useMutation(api.meals.create);
  const updateMeal = useMutation(api.meals.update);
  const togglePublished = useMutation(api.meals.togglePublished);
  const removeMeal = useMutation(api.meals.remove);

  const categories = useQuery(api.categories.list);
  const createCategory = useMutation(api.categories.create);
  const removeCategory = useMutation(api.categories.remove);

  const generateUploadUrl = useMutation(api.meals.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"meals"> | null>(null);
  const [form, setForm] = useState<MealForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleLogout = () => {
    sessionStorage.removeItem('loopit-admin');
    navigate('/admin');
  };

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    try {
      await createCategory({ name: trimmed });
      setNewCategoryName('');
    } catch {
      alert('Category already exists.');
    }
  };

  const handleDeleteCategory = async (id: Id<"categories">) => {
    if (window.confirm('Delete this category?')) {
      await removeCategory({ id });
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, ingredients: [{ name: '', amount: '', unit: '' }], notIncluded: [{ name: '', amount: '', unit: '' }], utensils: [''], nutrition: defaultNutrition.map((n) => ({ ...n })) });
    setShowForm(true);
  };

  const openEdit = (meal: NonNullable<typeof meals>[number]) => {
    setEditingId(meal._id);
    const ing = (meal.ingredients ?? []) as IngredientRow[];
    const notInc = (meal.notIncluded ?? []) as IngredientRow[];
    const uten = (meal.utensils ?? []) as string[];
    const nutr = (meal.nutrition ?? []) as NutritionRow[];
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
      serving: (meal as any).serving ?? '',
      allergens: (meal as any).allergens ?? '',
      ingredients: ing.length > 0 ? ing : [{ name: '', amount: '', unit: '' }],
      notIncluded: notInc.length > 0 ? notInc : [{ name: '', amount: '', unit: '' }],
      utensils: uten.length > 0 ? uten : [''],
      nutrition: nutr.length > 0 ? nutr : defaultNutrition.map((n) => ({ ...n })),
      published: meal.published,
    });
    setShowForm(true);
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
      serving: form.serving,
      allergens: form.allergens,
      ingredients: form.ingredients.filter((i) => i.name.trim()),
      notIncluded: form.notIncluded.filter((i) => i.name.trim()),
      utensils: form.utensils.filter((u) => u.trim()),
      nutrition: form.nutrition.filter((n) => n.value.trim()),
      published: form.published,
    };

    if (editingId) {
      await updateMeal({ id: editingId, ...payload });
    } else {
      await createMeal(payload);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: Id<"meals">) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      await removeMeal({ id });
    }
  };

  // --- Dynamic list helpers ---
  const updateIngredient = (list: 'ingredients' | 'notIncluded', idx: number, field: keyof IngredientRow, val: string) => {
    const arr = [...form[list]];
    arr[idx] = { ...arr[idx], [field]: val };
    setForm({ ...form, [list]: arr });
  };
  const addIngredient = (list: 'ingredients' | 'notIncluded') => {
    setForm({ ...form, [list]: [...form[list], { name: '', amount: '', unit: '' }] });
  };
  const removeIngredient = (list: 'ingredients' | 'notIncluded', idx: number) => {
    setForm({ ...form, [list]: form[list].filter((_, i) => i !== idx) });
  };

  const updateUtensil = (idx: number, val: string) => {
    const arr = [...form.utensils];
    arr[idx] = val;
    setForm({ ...form, utensils: arr });
  };
  const addUtensil = () => {
    setForm({ ...form, utensils: [...form.utensils, ''] });
  };
  const removeUtensil = (idx: number) => {
    setForm({ ...form, utensils: form.utensils.filter((_, i) => i !== idx) });
  };

  const updateNutrition = (idx: number, field: keyof NutritionRow, val: string) => {
    const arr = [...form.nutrition];
    arr[idx] = { ...arr[idx], [field]: val };
    setForm({ ...form, nutrition: arr });
  };
  const addNutrition = () => {
    setForm({ ...form, nutrition: [...form.nutrition, { label: '', value: '' }] });
  };
  const removeNutrition = (idx: number) => {
    setForm({ ...form, nutrition: form.nutrition.filter((_, i) => i !== idx) });
  };

  const getStorageUrl = useMutation(api.meals.getStorageUrl);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const url = await getStorageUrl({ storageId });
      if (url) {
        setForm((prev) => ({ ...prev, image: url }));
      }
    } catch {
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const renderIngredientList = (list: 'ingredients' | 'notIncluded', label: string) => (
    <div className="admin-form-group">
      <label>{label}</label>
      <div className="admin-dynamic-list">
        {form[list].map((item, idx) => (
          <div key={idx} className="admin-dynamic-row">
            <input placeholder="Name" value={item.name} onChange={(e) => updateIngredient(list, idx, 'name', e.target.value)} />
            <input placeholder="Amount" value={item.amount} onChange={(e) => updateIngredient(list, idx, 'amount', e.target.value)} className="admin-input-sm" />
            <input placeholder="Unit" value={item.unit} onChange={(e) => updateIngredient(list, idx, 'unit', e.target.value)} className="admin-input-sm" />
            <button type="button" className="admin-row-remove" onClick={() => removeIngredient(list, idx)} title="Remove">×</button>
          </div>
        ))}
        <button type="button" className="admin-row-add" onClick={() => addIngredient(list)}>+ Add item</button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
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
          <div className="admin-toolbar-actions">
            <button className="admin-cat-btn" onClick={() => setShowCategoryManager(true)}>Categories</button>
            <button className="admin-add-btn" onClick={openCreate}>+ Add Meal</button>
          </div>
        </div>

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
                  <th>Serving</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal._id}>
                    <td><img src={meal.image} alt={meal.name} className="admin-table-img" /></td>
                    <td className="admin-table-name">{meal.name}</td>
                    <td>{meal.category}</td>
                    <td>{meal.price}</td>
                    <td>{meal.time}</td>
                    <td>{(meal as any).serving || '—'}</td>
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

              {/* Basic info */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select category</option>
                    {(categories ?? []).map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
              </div>

              <div className="admin-form-group">
                <label>Meal Image</label>
                <div className="admin-image-upload">
                  <div className="admin-image-preview">
                    {form.image ? (
                      <img src={form.image} alt="Preview" />
                    ) : (
                      <span className="admin-image-preview-empty">No image</span>
                    )}
                  </div>
                  <div className="admin-image-controls">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="admin-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </button>
                    <span className="admin-upload-hint">JPG, PNG, or WebP. Max 5MB.</span>
                    <input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Or paste image URL"
                      style={{ marginTop: '0.25rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$6.99" required />
                </div>
                <div className="admin-form-group">
                  <label>Total Time</label>
                  <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="30 min" required />
                </div>
                <div className="admin-form-group">
                  <label>Prep Time</label>
                  <input value={form.prep} onChange={(e) => setForm({ ...form, prep: e.target.value })} placeholder="10 min" required />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Calories</label>
                  <input value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="820 kcal" required />
                </div>
                <div className="admin-form-group">
                  <label>Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Serving</label>
                  <input value={form.serving} onChange={(e) => setForm({ ...form, serving: e.target.value })} placeholder="2 people" required />
                </div>
              </div>

              {/* Allergens */}
              <div className="admin-form-group">
                <label>Allergens</label>
                <input value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} placeholder="Milk, Wheat" />
              </div>

              {/* Ingredients */}
              {renderIngredientList('ingredients', 'Ingredients')}

              {/* Not included */}
              {renderIngredientList('notIncluded', 'Not Included in Delivery')}

              {/* Utensils */}
              <div className="admin-form-group">
                <label>Utensils</label>
                <div className="admin-dynamic-list">
                  {form.utensils.map((item, idx) => (
                    <div key={idx} className="admin-dynamic-row">
                      <input placeholder="e.g. Peeler" value={item} onChange={(e) => updateUtensil(idx, e.target.value)} />
                      <button type="button" className="admin-row-remove" onClick={() => removeUtensil(idx)} title="Remove">×</button>
                    </div>
                  ))}
                  <button type="button" className="admin-row-add" onClick={addUtensil}>+ Add utensil</button>
                </div>
              </div>

              {/* Nutrition */}
              <div className="admin-form-group">
                <label>Nutrition Values (per serving)</label>
                <div className="admin-dynamic-list">
                  {form.nutrition.map((item, idx) => (
                    <div key={idx} className="admin-dynamic-row">
                      <input placeholder="Nutrient" value={item.label} onChange={(e) => updateNutrition(idx, 'label', e.target.value)} />
                      <input placeholder="Value (e.g. 38g)" value={item.value} onChange={(e) => updateNutrition(idx, 'value', e.target.value)} className="admin-input-sm" />
                      <button type="button" className="admin-row-remove" onClick={() => removeNutrition(idx)} title="Remove">×</button>
                    </div>
                  ))}
                  <button type="button" className="admin-row-add" onClick={addNutrition}>+ Add nutrient</button>
                </div>
              </div>

              {/* Publish */}
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
      {/* Category manager modal */}
      {showCategoryManager && (
        <div className="admin-modal-overlay" onClick={() => setShowCategoryManager(false)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Manage Categories</h3>
              <button className="admin-modal-close" onClick={() => setShowCategoryManager(false)}>×</button>
            </div>
            <div className="admin-cat-body">
              <div className="admin-cat-add">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                />
                <button onClick={handleAddCategory} className="admin-add-btn">Add</button>
              </div>
              <div className="admin-cat-list">
                {(categories ?? []).length === 0 ? (
                  <p className="admin-empty" style={{ padding: '1.5rem 0' }}>No categories yet.</p>
                ) : (
                  (categories ?? []).map((cat) => (
                    <div key={cat._id} className="admin-cat-item">
                      <span>{cat.name}</span>
                      <button className="admin-action-btn delete" onClick={() => handleDeleteCategory(cat._id)}>Delete</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
