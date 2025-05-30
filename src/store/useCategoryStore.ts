import { create } from 'zustand'
import type { Category } from '../types'

interface CategoryStore {
  selectedCategory: Category | null
  setSelectedCategory: (category: Category) => void
  clearSelectedCategory: () => void
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  clearSelectedCategory: () => set({ selectedCategory: null }),
}))