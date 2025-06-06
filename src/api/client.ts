import axios, { AxiosInstance } from "axios";
import camelcaseKeys from "camelcase-keys";

const baseURL = import.meta.env?.VITE_API_BASE_URL || "";

const createClient = (customBaseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: customBaseURL || baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.data && typeof response.data === "object") {
        response.data = camelcaseKeys(response.data, { deep: true });
      }
      return response;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const client = createClient();

export { createClient };
export default client;