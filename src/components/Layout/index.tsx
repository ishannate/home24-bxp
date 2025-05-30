import { Layout, Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "../../api/category";
import { buildCategoryTree, findCategoryById } from "../../utils/categoryTree";
import type { Category } from "../../types";
import styles from "./index.module.css";
import {
  FolderOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

const MainLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { id: currentCategoryId } = useParams<{ id: string }>();
  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory
  );

  const [categoryTree, setCategoryTree] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllCategories();
      const tree = buildCategoryTree(data);
      setCategoryTree(tree);

      if (currentCategoryId) {
        const selected = findCategoryById(tree, Number(currentCategoryId));
        if (selected) {
          setSelectedCategory(selected);
        }
      }
    };
    load();
  }, [currentCategoryId, setSelectedCategory]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  const userMenu: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const buildMenuItems = (categories: Category[]): MenuProps["items"] =>
    categories.map((cat) => ({
      key: String(cat.id),
      label: (
        <span className={styles.menuItem}>
          {cat.children?.length ? (
            <FolderOpenOutlined style={{ marginRight: 8 }} />
          ) : (
            <FolderOutlined style={{ marginRight: 8 }} />
          )}
          {cat.name}
        </span>
      ),
      children: cat.children?.length ? buildMenuItems(cat.children) : undefined,
    }));

  const categoryMenu: MenuProps = {
    items: buildMenuItems(categoryTree),
    selectedKeys: currentCategoryId ? [currentCategoryId] : [],
    onClick: ({ key }) => {
      const selected = findCategoryById(categoryTree, Number(key));
      if (selected) {
        setSelectedCategory(selected);
      }
      navigate(`/category/${key}`);
    },
  };

  return (
    <Layout className={styles.container}>
      <Header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.navLeft}>
            <span
              className={styles.logo}
              onClick={() => navigate("/dashboard")}
            >
              🗂 Home-24-BXP
            </span>
            <div className={styles.menu}>
              <span
                onClick={() => navigate("/dashboard")}
                className={styles.navItem}
              >
                Dashboard
              </span>
              <Dropdown menu={categoryMenu} trigger={["click"]}>
                <span className={styles.navItem} style={{ cursor: "pointer" }}>
                  Categories
                </span>
              </Dropdown>
            </div>
          </div>

          {user && (
            <div className={styles.navRight}>
              <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
                <Avatar className={styles.avatar}>
                  {getInitials(user.name)}
                </Avatar>
              </Dropdown>
            </div>
          )}
        </div>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
