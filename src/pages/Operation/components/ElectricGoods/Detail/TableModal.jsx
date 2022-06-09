import React from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import SkuListTable from './SkuListTable';

const TableModal = (props) => {
  const { visible, onClose, loading } = props;
  const { show = false, detail } = visible;

  const modalProps = {
    title: '详情',
    visible: show,
    closable: false,
    width: 800,
    footer: (
      <Button type="primary" onClick={onClose}>
        关闭
      </Button>
    ),
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <SkuListTable detail={detail} type="listSee"></SkuListTable>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['electricGoods/fetchGetGoodsForUpdate'],
}))(TableModal);
