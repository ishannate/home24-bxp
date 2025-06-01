import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Category, Product } from "../../types";
import CategoryProductList from ".";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../LastUpdatedProductWidget", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-last-updated-widget">
      Mocked LastUpdatedProductWidget
    </div>
  ),
}));

jest.mock("../Shared/ProductDrawer", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-product-drawer">Mocked ProductDrawer</div>
  ),
}));

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Test Product",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    units: 10,
    attributes: [],
    categoryId: 1,
  },
];

const mockCategory: Category = {
  id: 1,
  name: "Test Category",
};

const defaultProps = {
  products: mockProducts,
  pagination: { current: 1, pageSize: 10, total: 1 },
  loading: false,
  selectedCategory: mockCategory,
  sorter: {},
  drawerOpen: false,
  editingProduct: undefined,
  deleteModalOpen: false,
  deleting: false,
  productToDelete: null,
  lastUpdatedProductId: undefined,
  onTableChange: jest.fn(),
  onSubmit: jest.fn(),
  onDelete: jest.fn(),
  closeDrawer: jest.fn(),
  openDrawer: jest.fn(),
  onDeleteIntent: jest.fn(),
  onCancelDelete: jest.fn(),
  onEdit: jest.fn(),
};

describe("CategoryProductList", () => {
  it("renders table with products", () => {
    render(<CategoryProductList {...defaultProps} />);
    expect(screen.getByText(/Products in Test Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
  });

  it("calls openDrawer on Add Product click", () => {
    render(<CategoryProductList {...defaultProps} />);
    fireEvent.click(screen.getByText("+ Add Product"));
    expect(defaultProps.openDrawer).toHaveBeenCalled();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(<CategoryProductList {...defaultProps} />);
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockProducts[0]);
  });
});
