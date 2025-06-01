// src/components/CategoryList/CategoryListView.tsx
import { Typography, Spin, Tag, Card, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../types";
import styles from "./index.module.css";
import {
  DownOutlined,
  RightOutlined,
  FileOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface CategoryListProps {
  loading: boolean;
  categoryTree: Category[];
  activePanel: number | undefined;
  setActivePanel: (id: number | undefined) => void;
}

const CategoryList = ({
  loading,
  categoryTree,
  activePanel,
  setActivePanel,
}: CategoryListProps) => {
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
    <Flex className="container" vertical>
      <Title level={2} className="pageTitle">
        Browse Categories
      </Title>
      <Card className="cardWrapper">
        <Flex className={styles.horizontalWrapper}>
          {categoryTree.map((cat) => {
            const isActive = activePanel === cat.id;
            return (
              <Flex
                key={cat.id}
                className={`${styles.customPanel} ${
                  isActive ? styles.activePanel : ""
                }`}
              >
                <Flex
                  className={styles.panelHeader}
                  onClick={() => setActivePanel(isActive ? undefined : cat.id)}
                >
                  <Text className={styles.categoryName}>{cat.name}</Text>
                  <Flex className={styles.panelMeta}>
                    <Tag className={styles.statusTag}>Active</Tag>
                    {isActive ? (
                      <DownOutlined className={styles.toggleIcon} />
                    ) : (
                      <RightOutlined className={styles.toggleIcon} />
                    )}
                  </Flex>
                </Flex>

                <Flex
                  className={`${styles.panelContent} ${
                    isActive
                      ? styles.panelContentExpanded
                      : styles.panelContentCollapsed
                  }`}
                >
                  {isActive && renderSubcategories(cat.children)}
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Card>
    </Flex>
  );
};

export default CategoryList;
