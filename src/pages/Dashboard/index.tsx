import { useEffect, useState } from "react";
import { Flex, message, Typography } from "antd";
import { buildCategoryTree } from "../../utils/categoryTree";
import { getErrorMessage } from "../../utils/helper";
import type { Category } from "../../types";
import CategoryList from "../../components/CategoryList";
import LastUpdatedProductWidget from "../../components/LastUpdatedProductWidget";
import { useCategoryStore } from "../../store/useCategoryStore";

const { Title } = Typography;

const DashboardPage = () => {
  const { fetchCategories, categoryList } = useCategoryStore();
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchCategories();
      } catch (error) {
        message.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (categoryList.length > 0) {
      const tree = buildCategoryTree(categoryList);
      setCategoryTree(tree.filter((cat) => !cat.parentId));
    }
  }, [categoryList]);

  return (
    <Flex className="container" vertical>
      <Flex>
        <Title level={2} className="pageTitle">
          Browse Categories
        </Title>
      </Flex>
      <LastUpdatedProductWidget isCategoryBased={false} categoryList={categoryList}/>
      <CategoryList
        loading={loading}
        categoryTree={categoryTree}
      />
    </Flex>
  );
};

export default DashboardPage;
