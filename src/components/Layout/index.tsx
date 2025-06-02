import { Layout, Avatar, Dropdown, Flex, Typography, Drawer } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
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
  MenuOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { id: currentCategoryId } = useParams<{ id: string }>();
  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory
  );

  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllCategories();
      const tree = buildCategoryTree(data);
      setCategoryTree(tree);

      // ✅ Only set selected category if we're on a category page
      if (location.pathname.startsWith("/category/") && currentCategoryId) {
        const selected = findCategoryById(tree, Number(currentCategoryId));
        if (selected) {
          setSelectedCategory(selected);
        }
      }
    };
    load();
  }, [currentCategoryId, setSelectedCategory, location.pathname]);

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

  const renderCategory = (category: Category) => (
    <div key={category.id} className={styles.drawerItem}>
      <div
        className={styles.categoryLabel}
        onClick={() => {
          if(category.children?.length === 0){
          setSelectedCategory(category);
          navigate(`/category/${category.id}`);
          closeDrawer();
          }
        }}
      >
        {category.children?.length ? (
          <FolderOpenOutlined style={{ marginRight: 8 }} />
        ) : (
          <FolderOutlined style={{ marginRight: 8 }} />
        )}
        {category.name}
      </div>
      {category.children && (
        <Flex className={styles.subCategory} vertical>
          {category.children.map(renderCategory)}
        </Flex>
      )}
    </div>
  );

  return (
    <Layout className={styles.container}>
      <Header className={styles.header}>
        <Flex className={styles.headerInner}>
          <Flex className={styles.navLeft}>
            <Flex
              onClick={() => navigate("/dashboard")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <img
                src="/home-24.png"
                alt="Home24 Logo"
                style={{ height: "40px", marginRight: "16px" }}
              />
            </Flex>
            <Flex className={styles.menu}>
              <Flex className={styles.desktopMenu}>
                <Text
                  onClick={() => navigate("/dashboard")}
                  className={styles.navItem}
                >
                  Dashboard
                </Text>
                <Text
                  className={styles.navItem}
                  style={{ cursor: "pointer" }}
                  onClick={openDrawer}
                >
                  Categories
                </Text>
              </Flex>

              <Flex className={styles.mobileMenu}>
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        key: "dashboard",
                        label: "Dashboard",
                        onClick: () => navigate("/dashboard"),
                      },
                      {
                        key: "categories",
                        label: "Categories",
                        onClick: openDrawer,
                      },
                    ],
                  }}
                >
                  <span
                    className={styles.navItem}
                    style={{ cursor: "pointer" }}
                  >
                    <MenuOutlined className={styles.menuIcon} />
                  </span>
                </Dropdown>
              </Flex>
            </Flex>
          </Flex>

          {user && (
            <Flex className={styles.navRight}>
              <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
                <Avatar className={styles.avatar}>
                  {getInitials(user.name)}
                </Avatar>
              </Dropdown>
            </Flex>
          )}
        </Flex>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <Drawer
        title="Categories"
        placement="left"
        onClose={closeDrawer}
        open={isDrawerOpen}
      >
        <div className={styles.drawerMenu}>
          {categoryTree.map((cat) => renderCategory(cat))}
        </div>
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
