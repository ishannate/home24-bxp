import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Table, Typography, message, Card, Space, Divider } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { AttributeValue, Product } from '../../types';
import { fetchProductsByCategory } from '../../api/product';
import type { SorterResult } from 'antd/es/table/interface';
import { useCategoryStore } from '../../store/useCategoryStore';
import LastUpdatedProductWidget from '../LastUpdatedProductWidget';
import styles from './index.module.css';

const { Title, Text } = Typography;

const CategoryProductList = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCategory } = useCategoryStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
  });

  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});

  const fetchProducts = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, total } = await fetchProductsByCategory({
        categoryId: id,
        page: pagination.current,
        limit: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order as 'ascend' | 'descend',
      });
      setProducts(data);
      setPagination((prev) => ({ ...prev, total }));
    } catch {
      message.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id, pagination.current, pagination.pageSize, sorter]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    _: Record<string, unknown>,
    newSorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    const singleSorter = Array.isArray(newSorter) ? newSorter[0] : newSorter;
    const sortField =
      typeof singleSorter?.field === 'string' || typeof singleSorter?.field === 'number'
        ? String(singleSorter.field)
        : undefined;
    const sortOrder =
      singleSorter?.order === 'ascend' || singleSorter?.order === 'descend'
        ? singleSorter.order
        : undefined;
    setPagination(newPagination);
    setSorter({ field: sortField, order: sortOrder });
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      width: 100,
      responsive: ['md'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Attributes',
      dataIndex: 'attributes',
      render: (attrs: AttributeValue[]) =>
        attrs
          .map((attr) => {
            const val = Array.isArray(attr.value)
              ? attr.value.join(', ')
              : String(attr.value);
            return `${attr.code}: ${val}`;
          })
          .join(' | '),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
      responsive: ['md'],
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      render: (status: string) => (
        <span
          className={
            status === 'active' ? styles.statusActive : styles.statusInactive
          }
        >
          {status === 'active' ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
    {
      title: 'Units',
      dataIndex: 'units',
      sorter: true,
      render: (_: number, record: Product) =>
        record.status === 'active' ? record.units : '–',
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>
        Products in {selectedCategory?.name}
      </Title>
      <LastUpdatedProductWidget categoryId={id!} />
      <Card className={styles.tableCard}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
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
            onChange={handleTableChange}
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default CategoryProductList;
