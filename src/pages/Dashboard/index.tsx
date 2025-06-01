// src/components/CategoryList/CategoryListPage.tsx
import { useEffect, useState } from "react";
import { message } from "antd";
import { fetchAllCategories } from "../../api/category";
import { buildCategoryTree } from "../../utils/categoryTree";
import { getErrorMessage } from "../../utils/helper";
import type { Category } from "../../types";
import CategoryList from "../../components/CategoryList";

const DashboardPage = () => {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<number | undefined>();

  useEffect(() => {
    const load = async () => {
      try {
        const categories = await fetchAllCategories();
        const tree = buildCategoryTree(categories);
        setCategoryTree(tree.filter((cat) => !cat.parentId));
      } catch (error) {
        message.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <CategoryList
      loading={loading}
      categoryTree={categoryTree}
      activePanel={activePanel}
      setActivePanel={setActivePanel}
    />
  );
};

export default DashboardPage;
