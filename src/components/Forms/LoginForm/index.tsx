import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import styles from "./index.module.css";

const { Title } = Typography;

interface LoginFormProps {
  values: { email: string; password: string };
  errors: FormikErrors<{ email: string; password: string }>;
  touched: FormikTouched<{ email: string; password: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const LoginForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
}: LoginFormProps) => {
  return (
    <Flex className={styles.container}>
      <Card className={styles.card} variant="borderless">
        <Title level={2} className="pageTitle">Home 24-BXP</Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            htmlFor="email"
            validateStatus={touched.email && errors.email ? "error" : ""}
            help={touched.email && errors.email}
          >
            <Input
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            htmlFor="email"
            validateStatus={touched.password && errors.password ? "error" : ""}
            help={touched.password && errors.password}
          >
            <Input.Password
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter password"
            />
          </Form.Item>

          <Button type="primary" color="default" variant="solid" htmlType="submit">
            Login
          </Button>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginForm;
