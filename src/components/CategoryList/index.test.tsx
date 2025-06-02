import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CategoryList from ".";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockCategoryTree = [
  {
    id: 1,
    name: "Electronics",
    parentId: undefined,
    children: [
      { id: 3, name: "Phones", parentId: 1, children: [] },
      { id: 4, name: "Laptops", parentId: 1, children: [] },
    ],
  },
  {
    id: 2,
    name: "Books",
    parentId: undefined,
    children: [],
  },
];

const renderComponent = (props = {}) =>
  render(
    <BrowserRouter>
      <CategoryList loading={false} categoryTree={mockCategoryTree} {...props} />
    </BrowserRouter>
  );

describe("CategoryList", () => {
  it("shows loading spinner when loading is true", () => {
    render(
      <BrowserRouter>
        <CategoryList loading={true} categoryTree={[]} />
      </BrowserRouter>
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders category names", () => {
    renderComponent();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Books")).toBeInTheDocument();
  });

  it("renders subcategories", () => {
    renderComponent();
    expect(screen.getByText("Phones")).toBeInTheDocument();
    expect(screen.getByText("Laptops")).toBeInTheDocument();
  });

  it("navigates when a leaf subcategory is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Phones"));
    expect(mockedNavigate).toHaveBeenCalledWith("/category/3");
  });

  it("does not navigate when a parent category (non-leaf) is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Electronics"));
    expect(mockedNavigate).not.toHaveBeenCalledWith("/category/1");
  });

  it("does not throw if subcategories are undefined", () => {
    const categoryWithNoChildren = [
      {
        id: 5,
        name: "Empty Parent",
        parentId: undefined,
        children: undefined,
      },
    ];
    render(
      <BrowserRouter>
        <CategoryList loading={false} categoryTree={categoryWithNoChildren} />
      </BrowserRouter>
    );
    expect(screen.getByText("Empty Parent")).toBeInTheDocument();
  });
});
