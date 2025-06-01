import { Modal, Typography, Button, Flex } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmDeleteModal = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      footer={
        <Flex justify="flex-end" gap="small">
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button danger type="primary" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </Flex>
      }
      centered
      closable={false}
    >
      <Flex vertical align="center" style={{ padding: "20px 10px" }}>
        <ExclamationCircleOutlined style={{ fontSize: 32, color: "#faad14" }} />
        <Title level={4} style={{ marginTop: 16 }}>
          {title}
        </Title>
        <Text type="secondary">{description}</Text>
      </Flex>
    </Modal>
  );
};

export default ConfirmDeleteModal;
