import {
  Layout,
  Avatar,
  Dropdown,
  Flex,
  Typography,
  Drawer,
} from "antd";
import type { MenuProps } from "antd";
import {
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "../../api/category";
import {
  buildCategoryTree,
} from "../../utils/categoryTree";
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

  const renderCategory = (category: Category) => (
    <div key={category.id} className={styles.drawerItem}>
      <div
        className={styles.categoryLabel}
        onClick={() => {
          setSelectedCategory(category);
          navigate(`/category/${category.id}`);
          closeDrawer();
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
        <div className={styles.subCategory}>
          {category.children.map(renderCategory)}
        </div>
      )}
    </div>
  );

  return (
    <Layout className={styles.container}>
      <Header className={styles.header}>
        <Flex className={styles.headerInner}>
          <Flex className={styles.navLeft}>
            <Text
              className={styles.logo}
              onClick={() => navigate("/dashboard")}
            >
              24
            </Text>
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

      {/* Category Drawer */}
      <Drawer
        title="Categories"
        placement="left"
        onClose={closeDrawer}
        open={isDrawerOpen}
        bodyStyle={{ padding: "16px" }}
      >
        <div className={styles.drawerMenu}>
          {categoryTree.map((cat) => renderCategory(cat))}
        </div>
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
