import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { supabase } from '../lib/supabase';
import defaultCategories from '../lib/defaultCategories';

const STORAGE_KEY = 'speakeasy-categories';

const CategoriesContext = createContext({
  categories: [],
  loading: true,
  error: null,
  addCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  addItem: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},
  reorderCategories: async () => {},
  reorderItems: async () => {},
  resetToDefaults: async () => {},
});

export function useCategories() {
  return useContext(CategoriesContext);
}

export function CategoriesProvider({ children }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories based on auth state
  useEffect(() => {
    if (user && supabase) {
      loadFromSupabase();
    } else {
      loadFromLocalStorage();
    }
  }, [user]);

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCategories(JSON.parse(saved));
      } else {
        setCategories(defaultCategories);
      }
    } catch (e) {
      setCategories(defaultCategories);
    }
    setLoading(false);
  };

  const saveToLocalStorage = (cats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  };

  const loadFromSupabase = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order');

      if (catError) throw catError;

      // If user has no categories, seed with defaults
      if (categoriesData.length === 0) {
        await seedDefaultCategories();
        return;
      }

      // Fetch items for all categories
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order');

      if (itemsError) throw itemsError;

      // Combine into nested structure
      const combined = categoriesData.map((cat) => ({
        id: cat.category_key,
        dbId: cat.id,
        label: cat.label,
        icon: cat.icon,
        items: itemsData
          .filter((item) => item.category_id === cat.id)
          .map((item) => ({
            id: item.item_key,
            dbId: item.id,
            label: item.label,
            icon: item.icon,
            image: item.image_path,
          })),
      }));

      setCategories(combined);
      setError(null);
    } catch (e) {
      console.error('Error loading from Supabase:', e);
      setError(e.message);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultCategories = async () => {
    try {
      for (let i = 0; i < defaultCategories.length; i++) {
        const cat = defaultCategories[i];

        // Insert category
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .insert({
            user_id: user.id,
            category_key: cat.id,
            label: cat.label,
            icon: cat.icon,
            sort_order: i,
          })
          .select()
          .single();

        if (catError) throw catError;

        // Insert items
        const itemsToInsert = cat.items.map((item, j) => ({
          user_id: user.id,
          category_id: catData.id,
          item_key: item.id,
          label: item.label,
          icon: item.icon,
          sort_order: j,
        }));

        const { error: itemsError } = await supabase
          .from('items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      // Reload after seeding
      await loadFromSupabase();
    } catch (e) {
      console.error('Error seeding defaults:', e);
      setError(e.message);
      setCategories(defaultCategories);
      setLoading(false);
    }
  };

  const addCategory = useCallback(async (category) => {
    if (user && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          category_key: category.id,
          label: category.label,
          icon: category.icon,
          sort_order: categories.length,
        })
        .select()
        .single();

      if (error) throw error;

      const newCat = { ...category, dbId: data.id, items: [] };
      setCategories((prev) => [...prev, newCat]);
    } else {
      const newCategories = [...categories, { ...category, items: [] }];
      setCategories(newCategories);
      saveToLocalStorage(newCategories);
    }
  }, [user, categories]);

  const updateCategory = useCallback(async (categoryId, updates) => {
    if (user && supabase) {
      const cat = categories.find((c) => c.id === categoryId);
      if (cat?.dbId) {
        const { error } = await supabase
          .from('categories')
          .update({
            label: updates.label,
            icon: updates.icon,
          })
          .eq('id', cat.dbId);

        if (error) throw error;
      }
    }

    setCategories((prev) => {
      const updated = prev.map((c) =>
        c.id === categoryId ? { ...c, ...updates } : c
      );
      if (!user) saveToLocalStorage(updated);
      return updated;
    });
  }, [user, categories]);

  const deleteCategory = useCallback(async (categoryId) => {
    if (user && supabase) {
      const cat = categories.find((c) => c.id === categoryId);
      if (cat?.dbId) {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', cat.dbId);

        if (error) throw error;
      }
    }

    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== categoryId);
      if (!user) saveToLocalStorage(updated);
      return updated;
    });
  }, [user, categories]);

  const addItem = useCallback(async (categoryId, item) => {
    const cat = categories.find((c) => c.id === categoryId);

    if (user && supabase && cat?.dbId) {
      const { data, error } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          category_id: cat.dbId,
          item_key: item.id,
          label: item.label,
          icon: item.icon,
          image_path: item.image,
          sort_order: cat.items.length,
        })
        .select()
        .single();

      if (error) throw error;
      item.dbId = data.id;
    }

    setCategories((prev) => {
      const updated = prev.map((c) =>
        c.id === categoryId ? { ...c, items: [...c.items, item] } : c
      );
      if (!user) saveToLocalStorage(updated);
      return updated;
    });
  }, [user, categories]);

  const updateItem = useCallback(async (categoryId, itemId, updates) => {
    const cat = categories.find((c) => c.id === categoryId);
    const item = cat?.items.find((i) => i.id === itemId);

    if (user && supabase && item?.dbId) {
      const { error } = await supabase
        .from('items')
        .update({
          label: updates.label,
          icon: updates.icon,
          image_path: updates.image,
        })
        .eq('id', item.dbId);

      if (error) throw error;
    }

    setCategories((prev) => {
      const updated = prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, ...updates } : i
              ),
            }
          : c
      );
      if (!user) saveToLocalStorage(updated);
      return updated;
    });
  }, [user, categories]);

  const deleteItem = useCallback(async (categoryId, itemId) => {
    const cat = categories.find((c) => c.id === categoryId);
    const item = cat?.items.find((i) => i.id === itemId);

    if (user && supabase && item?.dbId) {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', item.dbId);

      if (error) throw error;
    }

    setCategories((prev) => {
      const updated = prev.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      );
      if (!user) saveToLocalStorage(updated);
      return updated;
    });
  }, [user, categories]);

  const reorderCategories = useCallback(async (newOrder) => {
    setCategories(newOrder);

    if (user && supabase) {
      // Update sort_order for each category in Supabase
      for (let i = 0; i < newOrder.length; i++) {
        const cat = newOrder[i];
        if (cat.dbId) {
          await supabase
            .from('categories')
            .update({ sort_order: i })
            .eq('id', cat.dbId);
        }
      }
    } else {
      saveToLocalStorage(newOrder);
    }
  }, [user]);

  const reorderItems = useCallback(async (categoryId, newItems) => {
    setCategories((prev) => {
      const updated = prev.map((c) =>
        c.id === categoryId ? { ...c, items: newItems } : c
      );
      if (!user) saveToLocalStorage(updated);
      return updated;
    });

    if (user && supabase) {
      // Update sort_order for each item in Supabase
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        if (item.dbId) {
          await supabase
            .from('items')
            .update({ sort_order: i })
            .eq('id', item.dbId);
        }
      }
    }
  }, [user]);

  const resetToDefaults = useCallback(async () => {
    if (user && supabase) {
      // Delete all user's categories (cascade deletes items)
      await supabase.from('categories').delete().eq('user_id', user.id);
      await seedDefaultCategories();
    } else {
      setCategories(defaultCategories);
      saveToLocalStorage(defaultCategories);
    }
  }, [user]);

  const value = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    reorderCategories,
    reorderItems,
    resetToDefaults,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
