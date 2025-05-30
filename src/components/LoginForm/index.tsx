// src/components/LoginForm.tsx
import { Button, Card, Form, Input, message } from "antd";
import { useFormik } from "formik";
import { login } from "../../api/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { getErrorMessage } from "../../utils/helper";
import styles from "./index.module.css";
import { loginSchema } from "../../validation/LoginSchema";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.login);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const { user, token } = await login(values.email, values.password);
        setUser(user, token);
        navigate("/dashboard");
      } catch (error) {
        message.error(getErrorMessage(error));
      }
    },
  });

  return (
    <div className={styles.container}>
      <Card className={styles.card} bordered={false}>
        <h2 className={styles.title}>Login</h2>
        <Form layout="vertical" onFinish={formik.handleSubmit}>
          <Form.Item
            label="Email"
            validateStatus={
              formik.errors.email && formik.touched.email ? "error" : ""
            }
            help={formik.touched.email && formik.errors.email}
          >
            <Input
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={
              formik.errors.password && formik.touched.password ? "error" : ""
            }
            help={formik.touched.password && formik.errors.password}
          >
            <Input.Password
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
