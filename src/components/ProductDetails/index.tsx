import { Card, Spin, Button, Typography, Flex } from "antd";
import type { Category, Product } from "../../types";
import { format } from "date-fns";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./index.module.css";

const { Title, Text } = Typography;

interface ProductDetailsProps {
  product: Product | null;
  category: Category | null;
  loading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductDetails = ({
  product,
  category,
  loading,
  onEdit,
  onDelete,
}: ProductDetailsProps) => {
  if (loading || !product) {
    return (
      <Flex align="center" justify="center" style={{ height: "60vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Flex className="container" vertical gap="large">
      {/* Header */}
      <Flex vertical>
        <Title level={3} style={{ marginBottom: 8 }}>
          {product.name}
        </Title>
      </Flex>

      {/* Action Buttons */}
      <Flex className={styles.buttonContainer}>
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>
        <Button icon={<DeleteOutlined />} danger onClick={onDelete}>
          Delete
        </Button>
      </Flex>

      {/* Side-by-Side Cards */}
      <Flex gap="large" wrap>
        {/* Category Card */}
        <Card
          className={`cardWrapper ${styles.cardWrapper}`}
          title="Category Details"
          style={{ flex: 1, minWidth: 300 }}
        >
          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Category Name</Text>
            <Text className={styles.detailValue}>{category?.name || "—"}</Text>
          </Flex>

          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Subcategories</Text>
            <Text className={styles.detailValue}>
              {category?.children?.length || 0}
            </Text>
          </Flex>

          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Category ID</Text>
            <Text className={styles.detailValue}>{category?.id || "—"}</Text>
          </Flex>
        </Card>

        {/* Product Card */}
        <Card
          className={`cardWrapper ${styles.cardWrapper}`}
          title="Product Details"
          style={{ flex: 2, minWidth: 300 }}
        >
          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Product Id</Text>
            <Text className={styles.detailValue}>{product.id}</Text>
          </Flex>

          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Status</Text>
            <Text className={styles.detailValue}>
              <Text type={product.status === "active" ? "success" : "danger"}>
                {product.status === "active" ? "Available" : "Unavailable"}
              </Text>
            </Text>
          </Flex>

          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Units</Text>
            <Text className={styles.detailValue}>{product.units}</Text>
          </Flex>

          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Created At</Text>
            <Text className={styles.detailValue}>
              {format(new Date(product.createdAt), "dd MMM yyyy, HH:mm")}
            </Text>
          </Flex>

          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Updated At</Text>
            <Text className={styles.detailValue}>
              {format(new Date(product.updatedAt), "dd MMM yyyy, HH:mm")}
            </Text>
          </Flex>

          <Flex className={styles.detailRow}>
            <Text className={styles.detailLabel}>Attributes</Text>
            <Text className={styles.detailValue}>
              {product.attributes.length === 0 ? (
                <Text type="secondary">No attributes</Text>
              ) : (
                <Flex vertical>
                  {product.attributes.map((attr) => (
                    <Flex key={attr.code} className={styles.attributeRow}>
                      <Text>{attr.code}</Text>
                      <Text>
                        {Array.isArray(attr.value)
                          ? attr.value.join(", ")
                          : attr.value}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

export default ProductDetails;
