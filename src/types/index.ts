export type Category = {
  id: number
  parentId?: number
  name: string
  children?: Category[]
}

export type Product = {
  id: number
  name: string
  categoryId: number
  attributes: AttributeValue[]
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  units: number;
}

export type CategoryWithProducts = Category & {
  products: Product[]
}

export type AttributeType = 'number' | 'text' | 'url' | 'tags' | 'boolean'

export type AttributeValue = 
  | { code: string; type: 'number'; value: number }
  | { code: string; type: 'text'; value: string }
  | { code: string; type: 'url'; value: string }
  | { code: string; type: 'tags'; value: string[] }
  | { code: string; type: 'boolean'; value: boolean }
export interface User {
  id: number
  email: string
  name: string
}

export interface ProductQueryParams {
  categoryId?: string
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
}

export interface ProductInput {
  name: string;
  categoryId: number;
  status: 'active' | 'inactive';
  units: number;
  attributes: AttributeValue[]
}

export type ProductRequest = {
  id?: number
  name?: string
  category_id?: number
  attributes?: AttributeValue[]
  createdAt?: string;
  updatedAt?: string;
  status?: 'active' | 'inactive';
  units?: number;
}
