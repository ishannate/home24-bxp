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
  width = 600,
  children,
}: DrawerWrapperProps) => {
  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      width={width}
    >
      {children}
    </Drawer>
  );
};

export default DrawerWrapper;
