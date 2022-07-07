import React from 'react';
import { Modal } from 'antd';
import SkuListTable from './SkuListTable';

const TableModal = (props) => {
  const { visible, onClose } = props;
  const { show = false, detail = {} } = visible;

  const { goodsName } = detail;

  const modalProps = {
    title: `详情 - ${goodsName}`, // 显示商品名称
    visible: show,
    width: 800,
    footer: false,
    onCancel: onClose,
    bodyStyle: { paddingBottom: 0 },
  };

  return (
    <Modal destroyOnClose maskClosable {...modalProps}>
      <SkuListTable detail={detail} type="listSee"></SkuListTable>
    </Modal>
  );
};

export default TableModal;
