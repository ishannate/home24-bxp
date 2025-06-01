import { render, screen, waitFor } from "@testing-library/react";
import LastUpdatedProductWidget from "./index";


// 👇 Define and mock API in-place
jest.mock("../../api/product", () => ({
  __esModule: true,
  fetchProductsByCategory: jest.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        name: "Mock Product",
        categoryId: 1,
        status: "active",
        units: 10,
        attributes: [],
        createdAt: "2023-01-01T10:00:00Z",
        updatedAt: "2023-01-02T15:00:00Z",
      },
    ],
  }),
}));

import { fetchProductsByCategory } from "../../api/product";
const mockedFetchProductsByCategory = fetchProductsByCategory as jest.Mock;

describe("LastUpdatedProductWidget (inline mock)", () => {
  it("renders product name and last updated info", async () => {
    render(<LastUpdatedProductWidget categoryId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Mock Product")).toBeInTheDocument();
      expect(screen.getByText(/Last updated at/i)).toBeInTheDocument();
    });

    expect(mockedFetchProductsByCategory).toHaveBeenCalledWith({
      categoryId: "1",
      sortField: "updatedAt",
      sortOrder: "descend",
      page: 1,
      limit: 1,
    });
  });
});
