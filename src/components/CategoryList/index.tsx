import { useEffect, useState } from "react";
import { Typography, Spin, Collapse, Tag, Card } from "antd";
import { fetchAllCategories } from "../../api/category";
import { buildCategoryTree } from "../../utils/categoryTree";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../types";
import styles from "./index.module.css";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const CategoryListPage = () => {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<string | string[]>("");

  useEffect(() => {
    const load = async () => {
      const categories = await fetchAllCategories();
      const tree = buildCategoryTree(categories);
      setCategoryTree(tree.filter((cat) => !cat.parent_id));
      setLoading(false);
    };

    load();
  }, []);

  const renderSubcategories = (children?: Category[]) => {
    if (!children || children.length === 0) return null;

    return (
      <ul className={styles.subcategoryList}>
        {children.map((child) => {
          const isLeaf = !child.children || child.children.length === 0;
          return (
            <li key={child.id} className={isLeaf ? styles.leafItem : ""}>
              <span className={styles.icon}>{isLeaf ? "📄" : "📁"}</span>
              <span
                className={`${isLeaf ? styles.leafLink : styles.nonLeaf}`}
                onClick={() => isLeaf && navigate(`/category/${child.id}`)}
              >
                {child.name}
              </span>
              {!isLeaf && renderSubcategories(child.children)}
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return (
      <Spin style={{ display: "block", margin: "80px auto" }} size="large" />
    );
  }

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>
        Browse Categories
      </Title>
      <Card className={styles.cardWrapper}>
        <Collapse
          accordion
          expandIcon={({ isActive }) => (
            <span className={styles.expandIconWrapper}>
              {isActive ? <DownOutlined /> : <RightOutlined />}
            </span>
          )}
          onChange={(key) => setActivePanel(key)}
          activeKey={activePanel}
          ghost
        >
          {categoryTree.map((cat) => {
            const isActive = String(activePanel) === String(cat.id);
            return (
              <Panel
                key={cat.id}
                header={
                  <div className={styles.panelHeader}>
                    <div className={styles.panelHeaderLeft}>
                      <span
                        className={`${styles.categoryName} ${
                          isActive ? styles.activeCategory : ""
                        }`}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <div className={styles.panelHeaderRight}>
                      <Tag className={styles.statusTag}>Active</Tag>
                      <Text type="secondary">
                        {cat.children?.length ?? 0} items
                      </Text>
                    </div>
                  </div>
                }
                className={`${styles.panel} ${
                  isActive ? styles.expandedPanel : ""
                }`}
              >
                {renderSubcategories(cat.children)}
              </Panel>
            );
          })}
        </Collapse>
      </Card>
    </div>
  );
};

export default CategoryListPage;
