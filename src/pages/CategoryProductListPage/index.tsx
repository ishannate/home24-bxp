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
  const [editingProduct, setEditingProduct] = useState<Product>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [lastUpdatedProductId, setLastUpdatedProductId] = useState<number>();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  });

  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});

  const fetchProducts = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, total } = await fetchProductsByCategory({
        categoryId: id,
        page: pagination.current,
        limit: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order as "ascend" | "descend",
      });
      setProducts(data);
      setPagination((prev) => ({ ...prev, total }));
    } catch {
      message.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [id, pagination.current, pagination.pageSize, sorter]);

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
    setPagination(newPagination);
    setSorter({ field: sortField, order: sortOrder });
  };

  const handleAddEditProduct = async (values: ProductInput) => {
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, values);
        message.success("Product updated successfully");
      } else {
        await createProduct(values);
        message.success("Product created successfully");
      }
      fetchProducts();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setDrawerOpen(false);
      if (selectedCategory?.id !== values.categoryId) {
        navigate(`/category/${values.categoryId}`);
      } else {
        setLastUpdatedProductId(editingProduct?.id);
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

  return (
    <CategoryProductList
          products={products}
          loading={loading}
          drawerOpen={drawerOpen}
          editingProduct={editingProduct}
          deleteModalOpen={deleteModalOpen}
          productToDelete={productToDelete}
          deleting={deleting}
          pagination={pagination}
          selectedCategory={selectedCategory}
          lastUpdatedProductId={lastUpdatedProductId}
          onTableChange={handleTableChange}
          onSubmit={handleAddEditProduct}
          onDelete={onDeleteProduct}
          openDrawer={() => setDrawerOpen(true)}
          closeDrawer={() => {
              setDrawerOpen(false);
              setEditingProduct(undefined);
          } }
          onEdit={(product: Product) => {
              setEditingProduct(product);
              setDrawerOpen(true);
          } }
          onDeleteIntent={(product: Product) => {
              setProductToDelete(product);
              setDeleteModalOpen(true);
          } }
          onCancelDelete={() => {
              setDeleteModalOpen(false);
              setProductToDelete(null);
          } } sorter={{
              field: undefined,
              order: undefined
          }}    />
  );
};

export default CategoryProductListPage;
