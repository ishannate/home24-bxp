import axios from './client'
import type { Product, Category, ProductQueryParams } from '../types'

export const fetchAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>('/categories')
  return response.data
}

export const fetchProductsByCategory = async ({
  categoryId,
  page = 1,
  limit = 10,
  sortField,
  sortOrder,
}: ProductQueryParams): Promise<{ data: Product[]; total: number }> => {
  const response = await axios.get('/products', {
    params: {
      category_id: categoryId,
      _page: page,
      _limit: limit,
      _sort: sortField,
      _order:
        sortOrder === 'ascend'
          ? 'asc'
          : sortOrder === 'descend'
          ? 'desc'
          : undefined,
    },
  })
console.log("response : ", response)
  const total = parseInt(response.headers['x-total-count'] || '0', 10)
  return { data: response.data, total }
}
