import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Clock, ClipboardCheck, CookingPot, Truck, CheckCircle, Ban, ChevronRight, ChevronLeft, RotateCcw, ExternalLink } from 'lucide-react';
import './AdminDashboard.css';

interface IngredientRow {
  name: string;
  amount: string;
  unit: string;
}

interface NutritionRow {
  label: string;
  amount: string;
  unit: string;
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
  ingredients: IngredientRow[];
  notIncluded: IngredientRow[];
  utensils: string[];
  nutrition: NutritionRow[];
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
  serving: '',
  ingredients: [{ name: '', amount: '', unit: '' }],
  notIncluded: [{ name: '', amount: '', unit: '' }],
  utensils: [''],
  nutrition: [{ label: '', amount: '', unit: '' }],
  published: false,
};

function AdminDashboard() {
  const navigate = useNavigate();
  const meals = useQuery(api.meals.listAll);
  const orders = useQuery(api.orders.listAllOrders);
  
  const createMeal = useMutation(api.meals.create);
  const updateMeal = useMutation(api.meals.update);
  const togglePublished = useMutation(api.meals.togglePublished);
  const toggleFeatured = useMutation(api.meals.toggleFeatured);
  const removeMeal = useMutation(api.meals.remove);

  const categories = useQuery(api.categories.list);
  const createCategory = useMutation(api.categories.create);
  const removeCategory = useMutation(api.categories.remove);

  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  const generateUploadUrl = useMutation(api.meals.generateUploadUrl);

  const [activeTab, setActiveTab] = useState<'meals' | 'orders'>('meals');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"meals"> | null>(null);
  const [form, setForm] = useState<MealForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const hasFormData = () => {
    return (
      form.name.trim() !== '' ||
      form.description.trim() !== '' ||
      form.image.trim() !== '' ||
      form.price.trim() !== '' ||
      form.time.trim() !== '' ||
      form.calories.trim() !== '' ||
      form.serving.trim() !== '' ||
      form.ingredients.some((i) => i.name.trim() !== '')
    );
  };

  const confirmClose = () => {
    if (hasFormData()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setShowForm(false);
        setEditingId(null);
      }
    } else {
      setShowForm(false);
      setEditingId(null);
    }
  };

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
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (meal: NonNullable<typeof meals>[number]) => {
    setEditingId(meal._id);
    const ing = (meal.ingredients ?? []) as IngredientRow[];
    const notInc = (meal.notIncluded ?? []) as IngredientRow[];
    const uten = (meal.utensils ?? []) as string[];
    const rawNutr = (meal.nutrition ?? []) as { label: string; value?: string; amount?: string; unit?: string }[];
    const nutr: NutritionRow[] = rawNutr.map((n) => {
      if (n.amount !== undefined) return { label: n.label, amount: n.amount, unit: n.unit ?? '' };
      const parts = (n.value ?? '').match(/^([\d.,]+)\s*(.*)$/);
      return { label: n.label, amount: parts?.[1] ?? n.value ?? '', unit: parts?.[2] ?? '' };
    });
    const stripUnit = (val: string, unit: string) => val.replace(unit, '').replace('$', '').trim();
    setForm({
      name: meal.name,
      description: meal.description,
      image: meal.image,
      time: stripUnit(meal.time, 'min'),
      prep: stripUnit(meal.prep, 'min'),
      price: stripUnit(meal.price, '$'),
      category: meal.category,
      calories: stripUnit(meal.calories, 'kcal'),
      difficulty: meal.difficulty,
      serving: stripUnit((meal as any).serving ?? '', 'people'),
      ingredients: ing.length > 0 ? ing : [{ name: '', amount: '', unit: '' }],
      notIncluded: notInc.length > 0 ? notInc : [{ name: '', amount: '', unit: '' }],
      utensils: uten.length > 0 ? uten : [''],
      nutrition: nutr.length > 0 ? nutr : [{ label: '', amount: '', unit: '' }],
      published: meal.published,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fmtPrice = form.price.startsWith('$') ? form.price : `$${form.price}`;
    const fmtTime = form.time.includes('min') ? form.time : `${form.time} min`;
    const fmtPrep = form.prep.includes('min') ? form.prep : `${form.prep} min`;
    const fmtCal = form.calories.includes('kcal') ? form.calories : `${form.calories} kcal`;
    const fmtServing = form.serving.includes('people') ? form.serving : `${form.serving} people`;

    const payload = {
      name: form.name,
      description: form.description,
      image: form.image,
      time: fmtTime,
      prep: fmtPrep,
      price: fmtPrice,
      category: form.category,
      calories: fmtCal,
      difficulty: form.difficulty,
      serving: fmtServing,
      ingredients: form.ingredients.filter((i) => i.name.trim()),
      notIncluded: form.notIncluded.filter((i) => i.name.trim()),
      utensils: form.utensils.filter((u) => u.trim()),
      nutrition: form.nutrition
        .filter((n) => n.label.trim())
        .map((n) => ({ label: n.label, value: `${n.amount} ${n.unit}`.trim() })),
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

  const handleStatusUpdate = async (orderId: Id<"orders">, newStatus: string) => {
    await updateOrderStatus({ orderId, status: newStatus });
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
    setForm({ ...form, nutrition: [...form.nutrition, { label: '', amount: '', unit: '' }] });
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
          <img src="/assets/images/android-chrome-192x192.png" alt="LoopIt" className="admin-header-logo" />
          <h1>LoopIt Admin</h1>
        </div>
        <div className="admin-header-right">
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'meals' ? 'active' : ''}`} onClick={() => setActiveTab('meals')}>Meals</button>
            <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              Orders {orders && orders.filter(o => o.status === 'Pending').length > 0 && <span className="admin-tab-badge">{orders.filter(o => o.status === 'Pending').length}</span>}
            </button>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="admin-main">
        {activeTab === 'meals' ? (
          <>
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
                      <th>Featured</th>
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
                          <button
                            className={`admin-status-badge ${(meal as any).featured ? 'featured' : 'not-featured'}`}
                            onClick={() => toggleFeatured({ id: meal._id })}
                          >
                            {(meal as any).featured ? 'Yes' : 'No'}
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
          </>
        ) : (
          <>
            <div className="admin-toolbar">
              <h2>Order Management</h2>
            </div>

            {orders === undefined ? (
              <p className="admin-loading">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="admin-empty">No orders found.</p>
            ) : (
              <div className="admin-orders-grid">
                {orders.map((order) => (
                  <div key={order._id} className="admin-order-card">
                    <div className="admin-order-header">
                      <div className="admin-order-user">
                        <h4>{order.user?.username || 'Unknown User'}</h4>
                        <p>{order.phone}</p>
                      </div>
                      <span className={`admin-order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    
                    <div className="admin-order-details">
                      <p><strong>Address:</strong> {order.address}</p>
                      {(order as any).addressMapUrl && (
                        <a
                          href={(order as any).addressMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-map-link"
                        >
                          <ExternalLink size={13} />
                          View on Google Maps
                        </a>
                      )}
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                      <div className="admin-order-items">
                        {order.items.map((item) => (
                          <div key={item._id} className="admin-order-item">
                            <span>{item.quantity} x {item.name}</span>
                            <span>{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="admin-order-total">
                        <strong>Total:</strong>
                        <span>{order.total}</span>
                      </div>
                    </div>

                    {(() => {
                      const flow = ['Pending', 'Approved', 'Preparing', 'Delivering', 'Delivered'];
                      const statusIcons: Record<string, React.ReactNode> = {
                        Pending: <Clock size={14} strokeWidth={2} />,
                        Approved: <ClipboardCheck size={14} strokeWidth={2} />,
                        Preparing: <CookingPot size={14} strokeWidth={2} />,
                        Delivering: <Truck size={14} strokeWidth={2} />,
                        Delivered: <CheckCircle size={14} strokeWidth={2} />,
                        Cancelled: <Ban size={14} strokeWidth={2} />,
                      };
                      const currentIdx = flow.indexOf(order.status);
                      const isCancelled = order.status === 'Cancelled';
                      const progress = isCancelled ? 0 : ((currentIdx) / (flow.length - 1)) * 100;
                      return (
                        <div className="admin-order-progress">
                          <div className="admin-status-row">
                            <span className={`admin-status-chip ${isCancelled ? 'cancelled' : ''}`}>
                              {statusIcons[order.status]}
                              {order.status}
                            </span>
                            {!isCancelled && order.status !== 'Delivered' && (
                              <span className="admin-status-next">
                                Next: {flow[currentIdx + 1]}
                              </span>
                            )}
                          </div>
                          <div className="admin-track-bar">
                            <div className="admin-track-fill" style={{ width: `${progress}%` }} />
                            {flow.map((step, i) => (
                              <div
                                key={step}
                                className={`admin-track-dot ${i <= currentIdx && !isCancelled ? 'reached' : ''} ${i === currentIdx && !isCancelled ? 'active' : ''}`}
                                title={step}
                                style={{ left: `${(i / (flow.length - 1)) * 100}%` }}
                              />
                            ))}
                          </div>
                          <div className="admin-progress-actions">
                            {!isCancelled && currentIdx > 0 && (
                              <button
                                type="button"
                                className="admin-progress-back"
                                onClick={() => handleStatusUpdate(order._id, flow[currentIdx - 1])}
                              >
                                <ChevronLeft size={14} strokeWidth={2.5} />
                                {flow[currentIdx - 1]}
                              </button>
                            )}
                            {!isCancelled && currentIdx < flow.length - 1 && (
                              <button
                                type="button"
                                className="admin-progress-advance"
                                onClick={() => handleStatusUpdate(order._id, flow[currentIdx + 1])}
                              >
                                {flow[currentIdx + 1]}
                                <ChevronRight size={14} strokeWidth={2.5} />
                              </button>
                            )}
                            {!isCancelled && order.status !== 'Delivered' && (
                              <button
                                type="button"
                                className="admin-progress-cancel"
                                onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                              >
                                <Ban size={13} strokeWidth={2} />
                                Cancel
                              </button>
                            )}
                            {isCancelled && (
                              <button
                                type="button"
                                className="admin-progress-restore"
                                onClick={() => handleStatusUpdate(order._id, 'Pending')}
                              >
                                <RotateCcw size={13} strokeWidth={2} />
                                Restore
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={confirmClose}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingId ? 'Edit Meal' : 'Add New Meal'}</h3>
              <button className="admin-modal-close" onClick={confirmClose}>×</button>
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
                  <div className="admin-input-unit">
                    <span className="admin-unit-prefix">$</span>
                    <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" required />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Total Time</label>
                  <div className="admin-input-unit">
                    <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="Total" required />
                    <span className="admin-unit-suffix">min</span>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Prep Time</label>
                  <div className="admin-input-unit">
                    <input value={form.prep} onChange={(e) => setForm({ ...form, prep: e.target.value })} placeholder="Prep" required />
                    <span className="admin-unit-suffix">min</span>
                  </div>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Calories</label>
                  <div className="admin-input-unit">
                    <input value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="Calories" required />
                    <span className="admin-unit-suffix">kcal</span>
                  </div>
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
                  <div className="admin-input-unit">
                    <input value={form.serving} onChange={(e) => setForm({ ...form, serving: e.target.value })} placeholder="Serving" required />
                    <span className="admin-unit-suffix">people</span>
                  </div>
                </div>
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
                      <input placeholder="Name" value={item.label} onChange={(e) => updateNutrition(idx, 'label', e.target.value)} />
                      <input placeholder="Amount" value={item.amount} onChange={(e) => updateNutrition(idx, 'amount', e.target.value)} className="admin-input-sm" />
                      <input placeholder="Unit" value={item.unit} onChange={(e) => updateNutrition(idx, 'unit', e.target.value)} className="admin-input-sm" />
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
                <button type="button" className="admin-cancel-btn" onClick={confirmClose}>Cancel</button>
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
