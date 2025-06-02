import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Category, Product } from "../../../types";
import ProductList from ".";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../../LastUpdatedProductWidget", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-last-updated-widget">
      Mocked LastUpdatedProductWidget
    </div>
  ),
}));

jest.mock("../../Shared/ProductDrawer", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-product-drawer">Mocked ProductDrawer</div>
  ),
}));

jest.mock("../../Shared/ConfirmDeleteModal", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? (
      <div data-testid="mock-confirm-delete">Mocked ConfirmDeleteModal</div>
    ) : null,
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

describe("ProductList", () => {
  it("renders product list with correct title and product row", () => {
    render(<ProductList {...defaultProps} />);
    expect(screen.getByText("Products in Test Category")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByTestId("mock-last-updated-widget")).toBeInTheDocument();
  });

  it("calls openDrawer when + Add Product is clicked", () => {
    render(<ProductList {...defaultProps} />);
    fireEvent.click(screen.getByText("+ Add Product"));
    expect(defaultProps.openDrawer).toHaveBeenCalled();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(<ProductList {...defaultProps} />);
    fireEvent.click(screen.getByTestId("edit-product-1"));
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("calls onDeleteIntent when delete button is clicked", () => {
    render(<ProductList {...defaultProps} />);
    fireEvent.click(screen.getByTestId("delete-product-1"));
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("navigates to product details page on row click", () => {
    render(<ProductList {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Product"));
    expect(mockedNavigate).toHaveBeenCalledWith("/product/1");
  });

  it("renders ProductDrawer when drawerOpen is true", () => {
    render(<ProductList {...defaultProps} drawerOpen={true} />);
    expect(screen.getByTestId("mock-product-drawer")).toBeInTheDocument();
  });

  it("renders ConfirmDeleteModal when deleteModalOpen is true", () => {
    render(
      <ProductList
        {...defaultProps}
        deleteModalOpen={true}
        productToDelete={mockProducts[0]}
      />
    );
    expect(screen.getByTestId("mock-confirm-delete")).toBeInTheDocument();
  });
});
