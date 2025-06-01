import { useFormik } from "formik";
import { login } from "../../api/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { getErrorMessage } from "../../utils/helper";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../validation/LoginSchema";
import LoginForm from "../../components/Forms/LoginForm";

const LoginPage = () => {
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
    <LoginForm
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      handleChange={formik.handleChange}
      handleBlur={formik.handleBlur}
      handleSubmit={formik.handleSubmit}
    />
  );
};

export default LoginPage;
