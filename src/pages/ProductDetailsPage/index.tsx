import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import type { Product, ProductInput } from "../../types";
import {
  getProductById,
  deleteProduct,
  updateProduct,
} from "../../api/product";
import ProductDrawer from "../../components/Shared/ProductDrawer";
import ConfirmDeleteModal from "../../components/Shared/ConfirmDeleteModal";
import { getErrorMessage } from "../../utils/helper";
import { useCategoryStore } from "../../store/useCategoryStore";
import ProductDetails from "../../components/Product/ProductDetails";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {selectedCategory} = useCategoryStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getProductById(Number(id));
      setProduct(data);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = () => {
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (!product) return;
    setDeleting(true);
    try {
      await deleteProduct(product.id);
      message.success("Product deleted successfully");
      navigate(`/category/${selectedCategory?.id}`);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleDrawerSubmit = async (values: ProductInput) => {
    if (id && Number(id)) {
      try {
        await updateProduct(Number(id), values);
        message.success("Product updated successfully");
      } catch (error) {
        message.error(getErrorMessage(error));
      } finally {
        setDrawerOpen(false);
        loadProduct();
      }
    }
  };

  return (
    <>
      <ProductDetails
        product={product}
        loading={loading}
        onEdit={handleUpdate}
        onDelete={() => setDeleteModalOpen(true)}
        category={selectedCategory}
      />
      <ProductDrawer
        open={drawerOpen}
        mode="edit"
        initialValues={product!}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleDrawerSubmit}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        title="Delete Product"
        description={`Are you sure you want to delete '${product?.name}'?`}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
};

export default ProductDetailsPage;
