import client from "./client";
import { isAxiosError } from "axios";
import type { User } from "../types";

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  try {
    const response = await client.get<User[]>("/users", {
      params: { email, password },
    });

    if (response.data.length === 0) {
      throw new Error("Invalid credentials");
    }

    return {
      user: response.data[0],
      token: "mocked-jwt-token-123",
    };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Login failed due to server error"
      );
    }
    throw new Error((error as Error).message || "Unexpected login error");
  }
}
