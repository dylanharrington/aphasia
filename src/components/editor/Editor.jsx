import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useCategories } from '../../hooks/useCategories';
import '../../styles/editor.css';

export default function Editor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    resetToDefaults,
  } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="editor">
        <div className="editor-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to App
          </button>
          <h1>Editor</h1>
        </div>
        <div className="editor-message">
          <p>Please sign in to customize your categories.</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCategory = {
      id: formData.get('id').toLowerCase().replace(/\s+/g, '-'),
      label: formData.get('label'),
      icon: formData.get('icon'),
    };
    await addCategory(newCategory);
    setShowNewCategory(false);
    e.target.reset();
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await updateCategory(editingCategory.id, {
      label: formData.get('label'),
      icon: formData.get('icon'),
    });
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Delete this category and all its items?')) {
      await deleteCategory(categoryId);
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
      }
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      id: formData.get('id').toLowerCase().replace(/\s+/g, '-'),
      label: formData.get('label'),
      icon: formData.get('icon'),
    };
    await addItem(selectedCategoryId, newItem);
    setShowNewItem(false);
    e.target.reset();
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await updateItem(selectedCategoryId, editingItem.id, {
      label: formData.get('label'),
      icon: formData.get('icon'),
    });
    setEditingItem(null);
  };

  const handleDeleteItem = async (itemId) => {
    if (confirm('Delete this item?')) {
      await deleteItem(selectedCategoryId, itemId);
    }
  };

  const handleResetToDefaults = async () => {
    if (confirm('Reset all categories to defaults? This will delete your customizations.')) {
      await resetToDefaults();
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="editor">
      <div className="editor-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to App
        </button>
        <h1>Customize Categories</h1>
        <button className="reset-button" onClick={handleResetToDefaults}>
          Reset to Defaults
        </button>
      </div>

      <div className="editor-layout">
        {/* Categories List */}
        <div className="editor-sidebar">
          <div className="sidebar-header">
            <h2>Categories</h2>
            <button className="add-button" onClick={() => setShowNewCategory(true)}>
              + Add
            </button>
          </div>

          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`category-item ${selectedCategoryId === cat.id ? 'selected' : ''}`}
              >
                <button
                  className="category-select"
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-label">{cat.label || cat.id}</span>
                </button>
                <div className="category-actions">
                  <button onClick={() => setEditingCategory(cat)} title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id)} title="Delete">
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* New Category Form */}
          {showNewCategory && (
            <form className="inline-form" onSubmit={handleAddCategory}>
              <input name="icon" placeholder="Icon (emoji)" required maxLength={2} />
              <input name="label" placeholder="Label (e.g., 'I want')" required />
              <input name="id" placeholder="ID (e.g., 'wants')" required />
              <div className="form-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowNewCategory(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Category Form */}
          {editingCategory && (
            <div className="modal-overlay" onClick={() => setEditingCategory(null)}>
              <form
                className="modal-form"
                onSubmit={handleUpdateCategory}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Edit Category</h3>
                <input
                  name="icon"
                  defaultValue={editingCategory.icon}
                  placeholder="Icon"
                  required
                />
                <input
                  name="label"
                  defaultValue={editingCategory.label}
                  placeholder="Label"
                  required
                />
                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Items Panel */}
        <div className="editor-main">
          {selectedCategory ? (
            <>
              <div className="items-header">
                <h2>
                  {selectedCategory.icon} {selectedCategory.label || selectedCategory.id}
                </h2>
                <button className="add-button" onClick={() => setShowNewItem(true)}>
                  + Add Item
                </button>
              </div>

              <ul className="items-list">
                {selectedCategory.items.map((item) => (
                  <li key={item.id} className="item-row">
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-label">{item.label}</span>
                    <div className="item-actions">
                      <button onClick={() => setEditingItem(item)} title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {selectedCategory.items.length === 0 && (
                <p className="empty-message">No items yet. Add some!</p>
              )}

              {/* New Item Form */}
              {showNewItem && (
                <form className="inline-form" onSubmit={handleAddItem}>
                  <input name="icon" placeholder="Icon (emoji)" required maxLength={2} />
                  <input name="label" placeholder="Label" required />
                  <input name="id" placeholder="ID" required />
                  <div className="form-actions">
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => setShowNewItem(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Item Modal */}
              {editingItem && (
                <div className="modal-overlay" onClick={() => setEditingItem(null)}>
                  <form
                    className="modal-form"
                    onSubmit={handleUpdateItem}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Edit Item</h3>
                    <input
                      name="icon"
                      defaultValue={editingItem.icon}
                      placeholder="Icon"
                      required
                    />
                    <input
                      name="label"
                      defaultValue={editingItem.label}
                      placeholder="Label"
                      required
                    />
                    <div className="form-actions">
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingItem(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="editor-placeholder">
              <p>Select a category to edit its items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
