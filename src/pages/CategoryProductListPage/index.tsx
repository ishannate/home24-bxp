import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import type { Product, ProductInput } from "../../types";
import {
  fetchProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product";
import { useCategoryStore } from "../../store/useCategoryStore";
import { getErrorMessage } from "../../utils/helper";
import CategoryProductList from "../../components/CategoryProductList";

const CategoryProductListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCategory } = useCategoryStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdatedProductId, setLastUpdatedProductId] = useState<number>();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formState, setFormState] = useState<{
    open: boolean;
    editingProduct?: Product;
  }>({ open: false });

 const [tableConfig, setTableConfig] = useState<{
  pagination: TablePaginationConfig;
  sorter: {
    field?: string;
    order?: 'ascend' | 'descend';
  };
}>({
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  },
  sorter: {
    field: undefined,
    order: undefined,
  },
});

  const fetchProducts = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, total } = await fetchProductsByCategory({
        categoryId: id,
        page: tableConfig.pagination.current,
        limit: tableConfig.pagination.pageSize,
        sortField: tableConfig.sorter.field,
        sortOrder: tableConfig.sorter.order as unknown as "ascend" | "descend",
      });
      setProducts(data);
      setTableConfig((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, total },
      }));
    } catch {
      message.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [id, tableConfig.pagination.current, tableConfig.pagination.pageSize, tableConfig.sorter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    _: Record<string, unknown>,
    newSorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    const singleSorter = Array.isArray(newSorter) ? newSorter[0] : newSorter;
    const sortField = typeof singleSorter?.field === "string" ? singleSorter.field : undefined;
    const sortOrder =
      singleSorter?.order === "ascend" || singleSorter?.order === "descend"
        ? singleSorter.order
        : undefined;

    setTableConfig({
      pagination: newPagination,
      sorter: { field: sortField, order: sortOrder },
    });
  };

  const handleAddEditProduct = async (values: ProductInput) => {
    try {
      if (formState.editingProduct?.id) {
        await updateProduct(formState.editingProduct.id, values);
        message.success("Product updated successfully");
      } else {
        await createProduct(values);
        message.success("Product created successfully");
      }
      fetchProducts();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setFormState({ open: false });
      if (selectedCategory?.id !== values.categoryId) {
        navigate(`/category/${values.categoryId}`);
      } else {
        setLastUpdatedProductId(formState.editingProduct?.id);
      }
    }
  };

  const onDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const openDrawer = useCallback(
    (product?: Product) => setFormState({ open: true, editingProduct: product }),
    []
  );

  const closeDrawer = useCallback(() => setFormState({ open: false }), []);

  const cancelDelete = useCallback(() => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  }, []);

  return (
    <CategoryProductList
      products={products}
      loading={loading}
      drawerOpen={formState.open}
      editingProduct={formState.editingProduct}
      deleteModalOpen={deleteModalOpen}
      productToDelete={productToDelete}
      deleting={deleting}
      pagination={tableConfig.pagination}
      sorter={tableConfig.sorter}
      selectedCategory={selectedCategory}
      lastUpdatedProductId={lastUpdatedProductId}
      onTableChange={handleTableChange}
      onSubmit={handleAddEditProduct}
      onDelete={onDeleteProduct}
      openDrawer={openDrawer}
      closeDrawer={closeDrawer}
      onEdit={openDrawer}
      onDeleteIntent={(product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
      }}
      onCancelDelete={cancelDelete}
    />
  );
};

export default CategoryProductListPage;
