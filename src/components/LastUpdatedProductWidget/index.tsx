import { useEffect, useState } from "react";
import { fetchAllProducts, fetchProductsByCategory } from "../../api/product";
import type { Category, Product } from "../../types";
import styles from "./index.module.css";
import { DoubleLeftOutlined } from "@ant-design/icons";

interface LastUpdatedProductWidgetProps {
  categoryId?: string;
  lastUpdatedProductId?: number;
  isCategoryBased?: boolean;
  categoryList?: Category[];
}

const LastUpdatedProductWidget = ({
  categoryId,
  lastUpdatedProductId,
  isCategoryBased = true,
  categoryList,
}: LastUpdatedProductWidgetProps) => {
  const [product, setProduct] = useState<Product | null>(null);

  const fetchLastUpdatedProduct = async () => {
    try {
      const fetchFn =
        isCategoryBased && categoryId
          ? () =>
              fetchProductsByCategory({
                categoryId,
                sortField: "updated_at",
                sortOrder: "descend",
                page: 1,
                limit: 1,
              })
          : () =>
              fetchAllProducts({
                sortField: "updated_at",
                sortOrder: "descend",
                page: 1,
                limit: 1,
              });

      const { data } = await fetchFn();
      setProduct(data.length ? data[0] : null);
    } catch (error) {
      console.error("Failed to fetch last updated product", error);
    }
  };

  useEffect(() => {
    fetchLastUpdatedProduct();
    fetchCategoryDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, isCategoryBased, lastUpdatedProductId]);

  const fetchCategoryDetails = () => {
    if (product && categoryList && categoryList.length > 0) {
      const category = categoryList.find(
        (category: Category) => category.id === product?.categoryId
      );

      return category?.name;
    }
  };

  if (!product) return null;

  const formattedDate = new Date(product.updatedAt).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetTitle}>
        <DoubleLeftOutlined className={styles.chevron} />
        Product: {product.name}
      </div>
      {!isCategoryBased && (
        <div className={styles.widgetSubtitle}>
          {" "}
          Category : {fetchCategoryDetails()}
        </div>
      )}
      <div className={styles.widgetSubtitle}>
        Last updated at:
        <div className={styles.widgetTime}>{formattedDate}</div>
      </div>
    </div>
  );
};

export default LastUpdatedProductWidget;
