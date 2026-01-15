import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useCategories } from '../../hooks/useCategories';
import { EmojiInput } from './EmojiPicker';
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
    reorderCategories,
    reorderItems,
    resetToDefaults,
  } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [newItemIcon, setNewItemIcon] = useState('');
  const [editCategoryIcon, setEditCategoryIcon] = useState('');
  const [editItemIcon, setEditItemIcon] = useState('');

  // Drag state
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Category drag handlers
  const handleCategoryDragStart = (e, index) => {
    setDraggedCategoryIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleCategoryDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedCategoryIndex(null);
    setDragOverIndex(null);
  };

  const handleCategoryDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCategoryIndex === null || draggedCategoryIndex === index) return;
    setDragOverIndex(index);
  };

  const handleCategoryDrop = (e, index) => {
    e.preventDefault();
    if (draggedCategoryIndex === null || draggedCategoryIndex === index) return;

    const newCategories = [...categories];
    const [dragged] = newCategories.splice(draggedCategoryIndex, 1);
    newCategories.splice(index, 0, dragged);
    reorderCategories(newCategories);

    setDraggedCategoryIndex(null);
    setDragOverIndex(null);
  };

  // Item drag handlers
  const handleItemDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleItemDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const handleItemDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    setDragOverIndex(index);
  };

  const handleItemDrop = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newItems = [...selectedCategory.items];
    const [dragged] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, dragged);
    reorderItems(selectedCategoryId, newItems);

    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

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
      icon: newCategoryIcon,
    };
    await addCategory(newCategory);
    setShowNewCategory(false);
    setNewCategoryIcon('');
    e.target.reset();
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await updateCategory(editingCategory.id, {
      label: formData.get('label'),
      icon: editCategoryIcon || editingCategory.icon,
    });
    setEditingCategory(null);
    setEditCategoryIcon('');
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
      icon: newItemIcon,
    };
    await addItem(selectedCategoryId, newItem);
    setShowNewItem(false);
    setNewItemIcon('');
    e.target.reset();
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await updateItem(selectedCategoryId, editingItem.id, {
      label: formData.get('label'),
      icon: editItemIcon || editingItem.icon,
    });
    setEditingItem(null);
    setEditItemIcon('');
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
            {categories.map((cat, index) => (
              <li
                key={cat.id}
                className={`category-item ${selectedCategoryId === cat.id ? 'selected' : ''} ${dragOverIndex === index && draggedCategoryIndex !== null ? 'drag-over' : ''}`}
                draggable
                onDragStart={(e) => handleCategoryDragStart(e, index)}
                onDragEnd={handleCategoryDragEnd}
                onDragOver={(e) => handleCategoryDragOver(e, index)}
                onDrop={(e) => handleCategoryDrop(e, index)}
              >
                <span className="drag-handle" title="Drag to reorder">⋮⋮</span>
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
              <EmojiInput
                value={newCategoryIcon}
                onChange={setNewCategoryIcon}
                placeholder="Choose icon"
              />
              <input name="label" placeholder="Label (e.g., 'I want')" required />
              <input name="id" placeholder="ID (e.g., 'wants')" required />
              <div className="form-actions">
                <button type="submit" disabled={!newCategoryIcon}>Add</button>
                <button type="button" onClick={() => { setShowNewCategory(false); setNewCategoryIcon(''); }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Category Form */}
          {editingCategory && (
            <div className="modal-overlay" onClick={() => { setEditingCategory(null); setEditCategoryIcon(''); }}>
              <form
                className="modal-form"
                onSubmit={handleUpdateCategory}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Edit Category</h3>
                <EmojiInput
                  value={editCategoryIcon || editingCategory.icon}
                  onChange={setEditCategoryIcon}
                  placeholder="Choose icon"
                />
                <input
                  name="label"
                  defaultValue={editingCategory.label}
                  placeholder="Label"
                  required
                />
                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => { setEditingCategory(null); setEditCategoryIcon(''); }}>
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
                {selectedCategory.items.map((item, index) => (
                  <li
                    key={item.id}
                    className={`item-row ${dragOverIndex === index && draggedItemIndex !== null ? 'drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleItemDragStart(e, index)}
                    onDragEnd={handleItemDragEnd}
                    onDragOver={(e) => handleItemDragOver(e, index)}
                    onDrop={(e) => handleItemDrop(e, index)}
                  >
                    <span className="drag-handle" title="Drag to reorder">⋮⋮</span>
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
                  <EmojiInput
                    value={newItemIcon}
                    onChange={setNewItemIcon}
                    placeholder="Choose icon"
                  />
                  <input name="label" placeholder="Label" required />
                  <input name="id" placeholder="ID" required />
                  <div className="form-actions">
                    <button type="submit" disabled={!newItemIcon}>Add</button>
                    <button type="button" onClick={() => { setShowNewItem(false); setNewItemIcon(''); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Item Modal */}
              {editingItem && (
                <div className="modal-overlay" onClick={() => { setEditingItem(null); setEditItemIcon(''); }}>
                  <form
                    className="modal-form"
                    onSubmit={handleUpdateItem}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Edit Item</h3>
                    <EmojiInput
                      value={editItemIcon || editingItem.icon}
                      onChange={setEditItemIcon}
                      placeholder="Choose icon"
                    />
                    <input
                      name="label"
                      defaultValue={editingItem.label}
                      placeholder="Label"
                      required
                    />
                    <div className="form-actions">
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => { setEditingItem(null); setEditItemIcon(''); }}>
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
