import { Typography, Spin, Tag, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../types";
import styles from "./index.module.css";
import {
  FileOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface CategoryListProps {
  loading: boolean;
  categoryTree: Category[];
}

const CategoryList = ({ loading, categoryTree }: CategoryListProps) => {
  const navigate = useNavigate();

  const renderSubcategories = (children?: Category[]) => {
    if (!children || children.length === 0) return null;

    return (
      <ul className={styles.subcategoryList}>
        {children.map((child) => {
          const isLeaf = !child.children || child.children.length === 0;
          return (
            <li key={child.id} className={styles.subcategoryItem}>
              <Flex
                className={`${styles.subcategoryLine} ${
                  isLeaf ? styles.leafNode : styles.parentNode
                }`}
                onClick={() => isLeaf && navigate(`/category/${child.id}`)}
              >
                <span className={styles.subcategoryIcon}>
                  {isLeaf ? <FileOutlined /> : <FolderOpenOutlined />}
                </span>
                <Text className={styles.subcategoryName}>{child.name}</Text>
              </Flex>
              {!isLeaf && renderSubcategories(child.children)}
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return (
      <Spin
        data-testid="loading-spinner"
        style={{ display: "block", margin: "80px auto" }}
        size="large"
      />
    );
  }

  return (
    <Flex className={styles.horizontalWrapper}>
      {categoryTree.map((cat) => (
        <Flex key={cat.id} className={styles.customPanel}>
          <Flex className={styles.panelHeader}>
            <Text className={styles.categoryName}>
              {cat.name}
              {cat.children && cat.children.length > 0 && (
                <span className={styles.childCount}>
                  {" "}
                  ({cat.children.length})
                </span>
              )}
            </Text>
            <Flex className={styles.panelMeta}>
              <Tag className={styles.statusTag}>Active</Tag>
            </Flex>
          </Flex>
          <Flex className={`${styles.panelContent} ${styles.panelContentExpanded}`}>
            {renderSubcategories(cat.children)}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default CategoryList;
