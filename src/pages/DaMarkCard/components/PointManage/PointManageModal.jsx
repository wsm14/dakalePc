import React from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import MarkInfoModal from './Detail/MarkInfoModal';
import PointListModal from './Detail/PointListModal';
import PointList from './List/PointList';

const PointManageModal = (props) => {
  const { loading, visible, onClose } = props;
  const { type = 'signDetail', show = false, detail = {}, tabKey } = visible;
  // 统一处理弹窗
  const drawerProps = {
    // 打卡明细
    signDetail: {
      title: `打卡明细-${detail.name}`,
      children: <MarkInfoModal detail={detail} tabKey={tabKey}></MarkInfoModal>,
    },
    //  点位 - 打卡点位列表
    point: {
      title: `打卡点位设置-${detail.name}`,
      children: <PointList detail={detail}></PointList>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    width: 1200,
    footer: <Button onClick={() => onClose()}>返回</Button>,
    onCancel: onClose,
  };
  return (
    <Modal destroyOnClose {...modalProps}>
      {drawerProps.children}
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['pointManage/fetchListHittingRecordManagement'],
}))(PointManageModal);
