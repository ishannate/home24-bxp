import { Drawer } from 'antd';
import type { ReactNode } from 'react';

interface DrawerWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  width?: number;
  children: ReactNode;
}

const DrawerWrapper = ({
  open,
  onClose,
  title,
  width = 400,
  children,
}: DrawerWrapperProps) => {
  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      width={width}
      destroyOnClose
    >
      {children}
    </Drawer>
  );
};

export default DrawerWrapper;
