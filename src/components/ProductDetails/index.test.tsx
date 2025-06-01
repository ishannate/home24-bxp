import { render, screen, fireEvent } from "@testing-library/react";
import type { Product, Category } from "../../types";
import { format } from "date-fns";
import ProductDetails from ".";

const mockProduct: Product = {
  id: 1,
  name: "Sample Product",
  categoryId: 10,
  status: "active",
  units: 100,
  createdAt: "2024-01-01T10:00:00Z",
  updatedAt: "2024-01-05T15:30:00Z",
  attributes: [
    { code: "color", value: "blue", type: 'text' },
  ],
};

const mockCategory: Category = {
  id: 10,
  name: "T-Shirts",
  parentId: undefined,
};

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe("ProductDetails", () => {
  it("renders product details correctly", () => {
    render(
      <ProductDetails
        product={mockProduct}
        category={mockCategory}
        loading={false}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    expect(screen.getByText("Sample Product")).toBeInTheDocument();
    expect(screen.getByText("Product ID: 1")).toBeInTheDocument();
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(
      screen.getByText(format(new Date(mockProduct.createdAt), "dd MMM yyyy, HH:mm"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(format(new Date(mockProduct.updatedAt), "dd MMM yyyy, HH:mm"))
    ).toBeInTheDocument();
    expect(screen.getByText("color:")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
  });

  it("calls onEdit when Edit button is clicked", () => {
    render(
      <ProductDetails
        product={mockProduct}
        category={mockCategory}
        loading={false}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(mockHandlers.onEdit).toHaveBeenCalled();
  });

  it("calls onDelete when Delete button is clicked", () => {
    render(
      <ProductDetails
        product={mockProduct}
        category={mockCategory}
        loading={false}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(mockHandlers.onDelete).toHaveBeenCalled();
  });
});
