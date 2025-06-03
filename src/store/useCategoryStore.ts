import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category } from '../types';
import { fetchAllCategories } from '../api/category';

interface CategoryStore {
  selectedCategory: Category | null;
  categoryList: Category[];
  loading: boolean;
  error: string | null;

  setSelectedCategory: (category: Category) => void;
  clearSelectedCategory: () => void;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      selectedCategory: null,
      categoryList: [],
      loading: false,
      error: null,

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      clearSelectedCategory: () => set({ selectedCategory: null }),

      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const categories = await fetchAllCategories();
          set({ categoryList: categories, loading: false });
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err.message
                : 'Failed to fetch categories',
            loading: false,
          });
        }
      },
    }),
    {
      name: 'category-store', // Key in localStorage
      partialize: (state) => ({
        selectedCategory: state.selectedCategory, // only persist this
      }),
    }
  )
);
