import type { Category } from '../types'
import axios from './client'

export const fetchAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>('/categories')
  return response.data
}
