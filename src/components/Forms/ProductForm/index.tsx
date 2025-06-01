import { Form, Input, InputNumber, Button, Space, Select, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useFormik,
  FieldArray,
  FormikProvider,
  type FormikErrors,
} from "formik";
import type { ProductInput, Category, AttributeValue } from "../../../types";
import { useEffect, useState } from "react";
import {  fetchLeafCategories } from "../../../api/category";
import { productSchema } from "../../../validation/ProductSchema";
import { getErrorMessage } from "../../../utils/helper";

const { Option } = Select;

interface ProductFormProps {
  initialValues?: ProductInput;
  defaultCategoryId?: number;
  mode: "create" | "edit";
  onCancel: () => void;
  onSubmit: (values: ProductInput) => void;
}

const ProductForm = ({
  initialValues,
  defaultCategoryId,
  mode,
  onCancel,
  onSubmit,
}: ProductFormProps) => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchLeafCategories();
        setCategoryList(cats);
      } catch (error) {
        message.error(getErrorMessage(error));
      }
    };
    loadCategories();
  }, []);

  if (mode === "create" && defaultCategoryId === undefined) {
    throw new Error("defaultCategoryId is required in create mode");
  }

  const formik = useFormik<ProductInput>({
    initialValues: initialValues || {
      name: "",
      categoryId: defaultCategoryId!, // safe due to the check above
      status: "active",
      units: 0,
      attributes: [],
    },
    validationSchema: productSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        <Form.Item
          label="Product Name"
          validateStatus={
            formik.errors.name && formik.touched.name ? "error" : ""
          }
          help={formik.touched.name && formik.errors.name}
        >
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter product name"
          />
        </Form.Item>

        <Form.Item
          label="Category"
          validateStatus={
            formik.errors.categoryId && formik.touched.categoryId
              ? "error"
              : ""
          }
          help={formik.touched.categoryId && formik.errors.categoryId}
        >
          <Select
            value={formik.values.categoryId}
            onChange={(val) => formik.setFieldValue("categoryId", val)}
            onBlur={() => formik.setFieldTouched("categoryId", true)}
            disabled={mode === "edit"}
            placeholder="Select category"
          >
            {categoryList.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          validateStatus={
            formik.errors.status && formik.touched.status ? "error" : ""
          }
          help={formik.touched.status && formik.errors.status}
        >
          <Select
            value={formik.values.status}
            onChange={(val) => formik.setFieldValue("status", val)}
            onBlur={() => formik.setFieldTouched("status", true)}
            placeholder="Select status"
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Units"
          validateStatus={
            formik.errors.units && formik.touched.units ? "error" : ""
          }
          help={formik.touched.units && formik.errors.units}
        >
          <InputNumber
            min={0}
            name="units"
            value={formik.values.units}
            onChange={(val) => formik.setFieldValue("units", val)}
            onBlur={() => formik.setFieldTouched("units", true)}
            style={{ width: "100%" }}
            placeholder="Enter number of units"
          />
        </Form.Item>

        <FieldArray
          name="attributes"
          render={(arrayHelpers) => (
            <>
              <label>Attributes</label>
              {formik.values.attributes.map((_, index) => (
                <Space
                  key={index}
                  align="baseline"
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item
                    validateStatus={
                      Array.isArray(formik.errors.attributes) &&
                      (
                        formik.errors
                          .attributes as FormikErrors<AttributeValue>[]
                      )[index]?.code &&
                      formik.touched.attributes?.[index]?.code
                        ? "error"
                        : ""
                    }
                    help={
                      formik.touched.attributes?.[index]?.code &&
                      Array.isArray(formik.errors.attributes) &&
                      (
                        formik.errors
                          .attributes as FormikErrors<AttributeValue>[]
                      )[index]?.code
                    }
                  >
                    <Input
                      name={`attributes[${index}].code`}
                      placeholder="Code"
                      value={formik.values.attributes[index].code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={
                      Array.isArray(formik.errors.attributes) &&
                      (
                        formik.errors
                          .attributes as FormikErrors<AttributeValue>[]
                      )[index]?.value &&
                      formik.touched.attributes?.[index]?.value
                        ? "error"
                        : ""
                    }
                    help={
                      formik.touched.attributes?.[index]?.value &&
                      Array.isArray(formik.errors.attributes) &&
                      (
                        formik.errors
                          .attributes as FormikErrors<AttributeValue>[]
                      )[index]?.value
                    }
                  >
                    <Input
                      name={`attributes[${index}].value`}
                      placeholder="Value"
                      value={String(
                        formik.values.attributes[index].value ?? ""
                      )}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Item>

                  <Form.Item
                    validateStatus={
                      Array.isArray(formik.errors.attributes) &&
                      (
                        formik.errors
                          .attributes as FormikErrors<AttributeValue>[]
                      )[index]?.type &&
                      formik.touched.attributes?.[index]?.type
                        ? "error"
                        : ""
                    }
                    help={
                      formik.touched.attributes?.[index]?.type &&
                      Array.isArray(formik.errors.attributes) &&
                      (
                        formik.errors
                          .attributes as FormikErrors<AttributeValue>[]
                      )[index]?.type
                    }
                  >
                    <Select
                      placeholder="Type"
                      style={{ width: 120 }}
                      value={formik.values.attributes[index].type}
                      onChange={(val) =>
                        formik.setFieldValue(`attributes[${index}].type`, val)
                      }
                      onBlur={() =>
                        formik.setFieldTouched(
                          `attributes[${index}].type`,
                          true
                        )
                      }
                    >
                      <Option value="string">String</Option>
                      <Option value="number">Number</Option>
                      <Option value="boolean">Boolean</Option>
                      <Option value="array">Array</Option>
                    </Select>
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => arrayHelpers.remove(index)}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    arrayHelpers.push({ code: "", value: "", type: "string" })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add Attribute
                </Button>
              </Form.Item>
            </>
          )}
        />

        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {mode === "edit" ? "Update" : "Create"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </FormikProvider>
  );
};

export default ProductForm;
