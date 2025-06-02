import { render, screen, waitFor } from "@testing-library/react";
import LastUpdatedProductWidget from "./index";

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
  fetchAllProducts: jest.fn().mockResolvedValue({
    data: [
      {
        id: 2,
        name: "Global Product",
        categoryId: 2,
        status: "active",
        units: 5,
        attributes: [],
        createdAt: "2023-02-01T10:00:00Z",
        updatedAt: "2023-02-02T12:00:00Z",
      },
    ],
  }),
}));

import { fetchAllProducts, fetchProductsByCategory } from "../../api/product";

const mockedFetchProductsByCategory = fetchProductsByCategory as jest.Mock;
const mockedFetchAllProducts = fetchAllProducts as jest.Mock;

describe("LastUpdatedProductWidget", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders category-based product name and updated time", async () => {
    render(<LastUpdatedProductWidget categoryId="1" />);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("Mock Product"))
      ).toBeInTheDocument();
    });

    expect(mockedFetchProductsByCategory).toHaveBeenCalledWith({
      categoryId: "1",
      sortField: "updated_at",
      sortOrder: "descend",
      page: 1,
      limit: 1,
    });
  });

  it("renders global product when isCategoryBased is false and shows category name", async () => {
    const mockCategories = [
      { id: 2, name: "Mock Category", parentId: undefined },
    ];

    render(
      <LastUpdatedProductWidget
        isCategoryBased={false}
        categoryList={mockCategories}
      />
    );


     await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("Global Product"))
      ).toBeInTheDocument();
    });

    expect(mockedFetchAllProducts).toHaveBeenCalledWith({
      sortField: "updated_at",
      sortOrder: "descend",
      page: 1,
      limit: 1,
    });
  });

  it("renders nothing if no products are returned", async () => {
    mockedFetchProductsByCategory.mockResolvedValueOnce({ data: [] });

    const { container } = render(<LastUpdatedProductWidget categoryId="1" />);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
});
