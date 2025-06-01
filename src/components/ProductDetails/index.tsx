import {
  Card,
  Descriptions,
  Spin,
  Button,
  Space,
  Typography,
  Flex,
} from "antd";
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
      <Card className={styles.cardHeader}>
        <Flex vertical style={{ marginBottom: "12px" }}>
          <Title level={3} style={{ margin: 0 }}>
            {product.name}
          </Title>
          <Text type="secondary">Product ID: {product.id}</Text>
        </Flex>
        <Space>
          <Button icon={<EditOutlined />} onClick={onEdit}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={onDelete}>
            Delete
          </Button>
        </Space>
      </Card>

      <Card className="cardWrapper" title="Product Details">
        <Descriptions
          column={1}
          size="middle"
          labelStyle={{ fontWeight: 500, width: 160 }}
        >
          <Descriptions.Item label="Category">
            {category?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Text type={product.status === "active" ? "success" : "danger"}>
              {product.status === "active" ? "Available" : "Unavailable"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Units">{product.units}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {format(new Date(product.createdAt), "dd MMM yyyy, HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {format(new Date(product.updatedAt), "dd MMM yyyy, HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Attributes">
            {product.attributes.length > 0 ? (
              <Flex vertical gap="small">
                {product.attributes.map((attr) => (
                  <Flex key={attr.code}>
                    <Text strong style={{ paddingRight: 8 }}>
                      {attr.code}:
                    </Text>
                    <Text>
                      {Array.isArray(attr.value)
                        ? attr.value.join(", ")
                        : attr.value}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Text type="secondary">No attributes</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Flex>
  );
};

export default ProductDetails;
