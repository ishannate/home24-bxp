import {
  Table,
  Typography,
  Card,
  Space,
  Divider,
  Button,
  Tooltip,
  Flex,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { format } from "date-fns";

import type { TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import type {
  AttributeValue,
  Product,
  ProductInput,
  Category,
} from "../../../types";

import LastUpdatedProductWidget from "../../LastUpdatedProductWidget";
import ProductDrawer from "../../Shared/ProductDrawer";
import ConfirmDeleteModal from "../../Shared/ConfirmDeleteModal";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface ProductListProps {
  products: Product[];
  pagination: TablePaginationConfig;
  loading: boolean;
  selectedCategory: Category | null;
  sorter: { field?: string; order?: string };
  drawerOpen: boolean;
  editingProduct?: Product;
  deleteModalOpen: boolean;
  deleting: boolean;
  productToDelete: Product | null;
  lastUpdatedProductId?: number;

  onTableChange: (
    newPagination: TablePaginationConfig,
    filters: Record<string, unknown>,
    sorter: SorterResult<Product> | SorterResult<Product>[]
  ) => void;

  onSubmit: (values: ProductInput) => void;
  onDelete: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  onDeleteIntent: (product: Product) => void;
  onCancelDelete: () => void;
  onEdit: (product: Product) => void;
}

const ProductList = ({
  products,
  pagination,
  loading,
  selectedCategory,
  drawerOpen,
  editingProduct,
  deleteModalOpen,
  deleting,
  productToDelete,
  lastUpdatedProductId,
  onTableChange,
  onSubmit,
  onDelete,
  closeDrawer,
  openDrawer,
  onDeleteIntent,
  onCancelDelete,
  onEdit,
}: ProductListProps) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      sorter: true,
      render: (date: string) => format(new Date(date), "dd-MM-yyyy HH:mm"),
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      sorter: true,
      render: (date: string) => format(new Date(date), "dd-MM-yyyy HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      render: (status: string) => (
        <span
          className={
            status === "active" ? styles.statusActive : styles.statusInactive
          }
        >
          {status === "active" ? "Available" : "Unavailable"}
        </span>
      ),
    },
    {
      title: "Units",
      dataIndex: "units",
      sorter: false,
      render: (_: number, record: Product) =>
        record.status === "active" ? record.units : "–",
    },
    {
      title: "Attributes",
      dataIndex: "attributes",
      render: (attrs: AttributeValue[]) =>
        attrs
          .map((attr) => {
            const val = Array.isArray(attr.value)
              ? attr.value.join(", ")
              : String(attr.value);
            return `${attr.code}: ${val}`;
          })
          .join(" | "),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      fixed: "right" as const,
      sorter: false,
      width: 60,
      align: "right" as const,
      render: (_: unknown, record: Product) => (
        <Space>
          <Tooltip title="Edit Product">
            <Button
              type="text"
              data-testid={`edit-product-${record.id}`}
              icon={<EditOutlined />}
              onClick={(e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                onEdit(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Product">
            <Button
              type="text"
                data-testid={`delete-product-${record.id}`}
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={(e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                onDeleteIntent(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Flex className="container" vertical>
      <Flex className={styles.headerRow}>
        <Title level={2} className="pageTitle">
          Products in {selectedCategory?.name}
        </Title>
        <Button color="default" variant="solid" onClick={openDrawer}>
          + Add Product
        </Button>
      </Flex>
      <LastUpdatedProductWidget
        categoryId={selectedCategory?.id?.toString() || ""}
        lastUpdatedProductId={lastUpdatedProductId}
      />

      <Card className="cardWrapper">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {pagination.total !== undefined && (
            <Text type="secondary">Total Products: {pagination.total}</Text>
          )}
          <Divider style={{ margin: 0 }} />
          <Table
            columns={columns}
            rowKey="id"
            loading={loading}
            dataSource={products}
            pagination={pagination}
            onChange={onTableChange}
            size="middle"
            scroll={{ x: "max-content" }}
            rowClassName={() => styles.tableRow}
            onRow={(record) => ({
              onClick: () => navigate(`/product/${record.id}`),
            })}
          />
        </Space>
      </Card>

      {drawerOpen && (
        <ProductDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          onSubmit={onSubmit}
          mode={editingProduct ? "edit" : "create"}
          initialValues={editingProduct}
        />
      )}

      <ConfirmDeleteModal
        open={deleteModalOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onCancel={onCancelDelete}
        onConfirm={onDelete}
        loading={deleting}
      />
    </Flex>
  );
};

export default ProductList;
