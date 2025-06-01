import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProductForm from "../ProductForm";
import { fetchLeafCategories } from "../../../api/category";

jest.mock("../../../api/category", () => ({
  __esModule: true,
  fetchLeafCategories: jest.fn(),
}));

const mockCategories = [
  { id: 1, name: "Phones" },
  { id: 2, name: "Laptops" },
];

const onSubmitMock = jest.fn();
const onCancelMock = jest.fn();

describe("ProductForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchLeafCategories as jest.Mock).mockResolvedValue(mockCategories);
  });

  it("renders the form with initial values", async () => {
    await act(async () => {
      render(
        <ProductForm
          mode="create"
          defaultCategoryId={1}
          onSubmit={onSubmitMock}
          onCancel={onCancelMock}
        />
      );
    });

    expect(await screen.findByPlaceholderText("Enter product name")).toBeInTheDocument();
    expect(screen.getByText("Add Attribute")).toBeInTheDocument();
  });

  it("submits form when valid", async () => {
    await act(async () => {
      render(
        <ProductForm
          mode="create"
          defaultCategoryId={1}
          onSubmit={onSubmitMock}
          onCancel={onCancelMock}
        />
      );
    });

    fireEvent.change(screen.getByPlaceholderText("Enter product name"), {
      target: { value: "iPhone 15" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter number of units"), {
      target: { value: "50" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "iPhone 15",
          units: 50,
          categoryId: 1,
          status: "active",
          attributes: [],
        })
      );
    });
  });

  it("calls onCancel when cancel button is clicked", async () => {
    await act(async () => {
      render(
        <ProductForm
          mode="create"
          defaultCategoryId={1}
          onSubmit={onSubmitMock}
          onCancel={onCancelMock}
        />
      );
    });

    fireEvent.click(screen.getByText("Cancel"));

    expect(onCancelMock).toHaveBeenCalled();
  });
});
