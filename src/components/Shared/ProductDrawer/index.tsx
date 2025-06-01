import { useCategoryStore } from "../../../store/useCategoryStore";
import type { Product, ProductInput } from "../../../types";
import ProductForm from "../../Forms/ProductForm";
import DrawerWrapper from "../DrawerWrapper";

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => void;
  mode?: "create" | "edit";
  initialValues?: Product;
}

const ProductDrawer = ({
  open,
  onClose,
  onSubmit,
  mode = "create",
  initialValues,
}: ProductDrawerProps) => {
  const { selectedCategory } = useCategoryStore();
  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit Product" : "Create New Product"}
    >
      <ProductForm
        initialValues={initialValues}
        defaultCategoryId={selectedCategory?.id}
        mode={mode}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </DrawerWrapper>
  );
};

export default ProductDrawer;
