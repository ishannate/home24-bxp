import client from "./client";
import type { AxiosError } from "axios";
import type {
  Product,
  ProductQueryParams,
  ProductInput,
  ProductRequest,
} from "../types";

export const fetchAllProducts = async ({
  page = 1,
  limit = 10,
  sortField,
  sortOrder,
}: ProductQueryParams): Promise<{ data: Product[]; total: number }> => {
  try {
    const response = await client.get("/products", {
      params: {
        _page: page,
        _limit: limit,
        _sort: sortField,
        _order:
          sortOrder === "ascend"
            ? "asc"
            : sortOrder === "descend"
            ? "desc"
            : undefined,
      },
    });

    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to fetch products.");
  }
};

export const fetchProductsByCategory = async ({
  categoryId,
  page = 1,
  limit = 10,
  sortField,
  sortOrder,
}: ProductQueryParams): Promise<{ data: Product[]; total: number }> => {
  try {
    const response = await client.get("/products", {
      params: {
        category_id: categoryId,
        _page: page,
        _limit: limit,
        _sort: sortField,
        _order:
          sortOrder === "ascend"
            ? "asc"
            : sortOrder === "descend"
            ? "desc"
            : undefined,
      },
    });

    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to fetch products.");
  }
};

export const getProductById = async (id: number | string): Promise<Product> => {
  try {
    const response = await client.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to create product.");
  }
};

export const createProduct = async (values: ProductInput): Promise<Product> => {
  try {
    const product: ProductRequest = {
      ...values,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await client.post("/products", product);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to create product.");
  }
};

export const updateProduct = async (
  id: number,
  values: ProductInput
): Promise<Product> => {
  try {
    const product: ProductRequest = {
      ...values,
      updatedAt: new Date().toISOString(),
    };
    const response = await client.patch(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to update product.");
  }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const response = await client.delete(`/products/${id}`);
    return response.status === 204;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || "Failed to delete product.");
  }
};
