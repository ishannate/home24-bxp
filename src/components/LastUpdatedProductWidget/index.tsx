import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "../../api/product";
import type { Product } from "../../types";
import styles from "./index.module.css";
import { DoubleLeftOutlined } from '@ant-design/icons'

interface LastUpdatedProductWidgetProps {
  categoryId: string;
}

const LastUpdatedProductWidget = ({
  categoryId,
}: LastUpdatedProductWidgetProps) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchLastUpdatedProduct = async () => {
      try {
        const { data } = await fetchProductsByCategory({
          categoryId,
          sortField: "updatedAt",
          sortOrder: "descend",
          page: 1,
          limit: 1,
        });

          setProduct(data[0]);
      } catch (error) {
        console.error("Failed to fetch last updated product", error);
      }
    };

    fetchLastUpdatedProduct();
  }, [categoryId]);

  if (!product) return null;

  const formattedDate = new Date(product.updatedAt).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetTitle}>
        <DoubleLeftOutlined className={styles.chevron} />
        {product.name}
      </div>
      <div className={styles.widgetSubtitle}>
        Last updated at
        <div className={styles.widgetTime}>{formattedDate}</div>
      </div>
    </div>
  );
};

export default LastUpdatedProductWidget;
