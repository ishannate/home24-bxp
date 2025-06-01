import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().required("Product name is required"),
  categoryId: yup.number().required("Category is required"),
  status: yup.string().oneOf(["active", "inactive"]).required("Status is required"),
  units: yup
    .number()
    .required("Units are required")
    .min(0, "Units must be at least 0"),
  attributes: yup.array().of(
    yup.object().shape({
      code: yup.string().required("Attribute code is required"),
      value: yup.string().required("Attribute value is required"),
      type: yup
        .string()
        .oneOf(["string", "number", "boolean", "array"])
        .required("Attribute type is required"),
    })
  ),
});
