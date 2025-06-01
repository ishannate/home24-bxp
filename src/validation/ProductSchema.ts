import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().required("Product name is required"),
  categoryId: yup.number().required("Category is required"),
  status: yup
    .string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),
  units: yup
    .number()
    .required("Units are required")
    .min(0, "Units must be at least 0"),
  attributes: yup.array().of(
    yup.object().shape({
      code: yup.string().required("Attribute code is required"),
      type: yup
        .string()
        .oneOf(["string", "number", "boolean", "array"])
        .required("Attribute type is required"),
      value: yup.mixed().when("type", ([type], schema) => {
        switch (type) {
          case "string":
            return yup
              .string()
              .required("Value must be a string");
          case "number":
            return yup
              .number()
              .typeError("Value must be a number")
              .required("Value is required");
          case "boolean":
            return yup
              .boolean()
              .typeError("Value must be a boolean")
              .required("Value is required");
          case "array":
            return yup
              .array()
              .of(yup.string())
              .typeError("Value must be an array of strings")
              .required("Value is required");
          default:
            return schema; // fallback
        }
      }),
    })
  ),
});
