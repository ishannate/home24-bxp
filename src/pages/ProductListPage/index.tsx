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
import ProductList from "../../components/Product/ProductList";

const ProductListPage = () => {
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
  }>({ open: false, editingProduct: undefined });

  const [tableConfig, setTableConfig] = useState<{
    pagination: TablePaginationConfig;
    sorter: {
      field?: string;
      order?: "ascend" | "descend";
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
        sortOrder: tableConfig.sorter.order as "ascend" | "descend" | undefined,
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
  }, [
    id,
    tableConfig.pagination.current,
    tableConfig.pagination.pageSize,
    tableConfig.sorter,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    _: Record<string, unknown>,
    newSorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    const singleSorter = Array.isArray(newSorter) ? newSorter[0] : newSorter;
    const sortField =
      typeof singleSorter?.field === "string" ? singleSorter.field : undefined;
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
      let newlyCreatedUpdatedProduct = undefined;
      if (formState.editingProduct?.id) {
        newlyCreatedUpdatedProduct = await updateProduct(
          formState.editingProduct.id,
          values
        );
        message.success("Product updated successfully");
      } else {
        newlyCreatedUpdatedProduct = await createProduct(values);
        message.success("Product created successfully");
      }
      setLastUpdatedProductId(newlyCreatedUpdatedProduct?.id);
      fetchProducts();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setFormState({ open: false, editingProduct: undefined });
      if (selectedCategory?.id !== values.categoryId) {
        navigate(`/category/${values.categoryId}`);
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
      setLastUpdatedProductId(0);
    }
  };

  const openDrawer = useCallback((product?: Product) => {
    if (product) {
      setFormState({ open: true, editingProduct: product }); // editing
    } else {
      setFormState({ open: true, editingProduct: undefined }); // adding
    }
  }, []);

  const closeDrawer = useCallback(() => {
    setFormState({ open: false, editingProduct: undefined });
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  }, []);

  return (
    <ProductList
      products={products}
      loading={loading}
      drawerOpen={formState.open}
      editingProduct={
        formState.editingProduct?.id ? formState.editingProduct : undefined
      }
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

export default ProductListPage;
