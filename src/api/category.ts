import client from "./client";
import type { Category } from "../types";
import type { AxiosError } from "axios";

export const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await client.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch categories."
    );
  }
};

export const fetchLeafCategories = async (): Promise<Category[]> => {
  try {
    const response = await client.get<Category[]>("/categories");

    const allCategories = response.data;

    // Identify parent category IDs
    const parentIds = new Set(
      allCategories.map((cat) => cat.parentId).filter(Boolean)
    );

    // Return categories that are not parents
    const leafCategories = allCategories.filter(
      (cat) => !parentIds.has(cat.id)
    );

    return leafCategories;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch categories."
    );
  }
};
