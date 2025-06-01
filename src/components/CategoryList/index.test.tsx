import { render, screen, fireEvent, } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryList from '.';

// 🧪 Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const mockCategoryTree = [
  {
    id: 1,
    name: 'Electronics',
    parentId: undefined,
    children: [
      { id: 3, name: 'Phones', parentId: 1, children: [] },
      { id: 4, name: 'Laptops', parentId: 1, children: [] },
    ],
  },
  {
    id: 2,
    name: 'Books',
    parentId: undefined,
    children: [],
  },
];

const renderComponent = (props = {}) =>
  render(
    <BrowserRouter>
      <CategoryList
        loading={false}
        categoryTree={mockCategoryTree}
        activePanel={undefined}
        setActivePanel={jest.fn()}
        {...props}
      />
    </BrowserRouter>
  );

describe('CategoryListView', () => {
  it('shows loading spinner when loading is true', () => {
    renderComponent({ loading: true });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders category titles when loading is false', () => {
    renderComponent();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('calls setActivePanel when a category panel header is clicked', () => {
    const setActivePanel = jest.fn();
    renderComponent({ setActivePanel });
    fireEvent.click(screen.getByText('Electronics'));
    expect(setActivePanel).toHaveBeenCalledWith(1);
  });

  it('renders subcategories when activePanel matches category', () => {
    renderComponent({ activePanel: 1 });
    expect(screen.getByText('Phones')).toBeInTheDocument();
    expect(screen.getByText('Laptops')).toBeInTheDocument();
  });

  it('navigates when clicking a leaf subcategory', () => {
    renderComponent({ activePanel: 1 });
    fireEvent.click(screen.getByText('Phones'));
    expect(mockedNavigate).toHaveBeenCalledWith('/category/3');
  });
});
