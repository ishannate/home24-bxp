import { render, screen, fireEvent } from "@testing-library/react";
import { format } from "date-fns";
import ProductDetails from ".";
import type { Category, Product } from "../../../types";

const mockProduct: Product = {
  id: 1,
  name: "Sample Product",
  categoryId: 10,
  status: "active",
  units: 100,
  createdAt: "2024-01-01T10:00:00Z",
  updatedAt: "2024-01-05T15:30:00Z",
  attributes: [{ code: "color", value: "blue", type: "text" }],
};

const mockCategory: Category = {
  id: 10,
  name: "T-Shirts",
  parentId: undefined,
  children: [], // to ensure 'Subcategories' renders correctly
};

describe("ProductDetails", () => {
  let onEditMock: jest.Mock;
  let onDeleteMock: jest.Mock;

  beforeEach(() => {
    onEditMock = jest.fn();
    onDeleteMock = jest.fn();
  });

  it("renders product and category details correctly", () => {
    render(
      <ProductDetails
        product={mockProduct}
        category={mockCategory}
        loading={false}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    // Product title and ID
    expect(screen.getByText("Sample Product")).toBeInTheDocument();
    expect(screen.getByText("Product ID: 1")).toBeInTheDocument();

    // Category details
    expect(screen.getByText("Category Details")).toBeInTheDocument();
    expect(screen.getByText("Category Name")).toBeInTheDocument();
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
    expect(screen.getByText("Subcategories")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Category ID")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    // Product details
    expect(screen.getByText("Product Details")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Units")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Created At")).toBeInTheDocument();
    expect(
      screen.getByText(format(new Date(mockProduct.createdAt), "dd MMM yyyy, HH:mm"))
    ).toBeInTheDocument();
    expect(screen.getByText("Updated At")).toBeInTheDocument();
    expect(
      screen.getByText(format(new Date(mockProduct.updatedAt), "dd MMM yyyy, HH:mm"))
    ).toBeInTheDocument();

    // Attributes
    expect(screen.getByText("Attributes")).toBeInTheDocument();
    expect(screen.getByText("color")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
  });

  it("calls onEdit when Edit button is clicked", () => {
    render(
      <ProductDetails
        product={mockProduct}
        category={mockCategory}
        loading={false}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete button is clicked", () => {
    render(
      <ProductDetails
        product={mockProduct}
        category={mockCategory}
        loading={false}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
