import { Card, Spin, Button, Typography, Flex, Image } from "antd";
import type { Category, Product } from "../../../types";
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
    <Flex className="container" gap="large" wrap>
      {/* Left Card with Image and Info */}
      <Card
        className={styles.cardWrapper}
        style={{ flex: 1, minWidth: 280, maxWidth: 650, height: "fit-content" }}
      >
        <Flex vertical gap={8} style={{ marginBottom: 24 }}>
          <Title
            level={4}
            style={{ marginBottom: 0, fontSize: 24, fontWeight: 700 }}
          >
            {product.name}
          </Title>
          <Text type="secondary">Product ID: {product.id}</Text>
        </Flex>
        <Image
          alt="product sample"
          src="/sample-furniture.jpeg"
          preview={false}
          style={{
            objectFit: "cover",
            width: "100%",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          }}
        />
        <Flex gap={16} style={{ marginTop: 32 }} vertical>
          <Button
            icon={<EditOutlined />}
            color="default"
            variant="solid"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            variant="solid"
            color="danger"
            onClick={onDelete}
          >
            Delete
          </Button>
        </Flex>
      </Card>

      {/* Right Section with Category and Product Cards */}
      <Flex vertical flex={2} gap="large" style={{ minWidth: 300 }}>
        {/* Category Card */}
        <Card
          className={styles.cardWrapper}
          title="Category Details"
          style={{ width: "100%" }}
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

        {/* Product Details Card */}
        <Card
          className={styles.cardWrapper}
          title="Product Details"
          style={{ width: "100%" }}
        >
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

          <Flex className={styles.detailRow} vertical>
            <Text className={styles.detailLabel}>Attributes</Text>
            {product.attributes.length === 0 ? (
              <Text type="secondary">No attributes</Text>
            ) : (
              <Flex vertical gap={4} style={{ marginTop: 8 }}>
                {product.attributes.map((attr) => (
                  <Flex key={attr.code} className={styles.attributeRow}>
                    <Text strong>{attr.code}</Text>
                    <Text>
                      {Array.isArray(attr.value)
                        ? attr.value.join(", ")
                        : attr.value}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

export default ProductDetails;
