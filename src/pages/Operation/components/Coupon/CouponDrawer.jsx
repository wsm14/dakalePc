import React from 'react';
import { connect } from 'umi';
import DrawerCondition from '@/components/DrawerCondition';
import CouponDetail from './Detail/CouponDetail';

const CouponDrawer = (props) => {
  const { visible, onClose } = props;

  const { type = 'info', shwo = false, detail = {} } = visible;

  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看详情',
      showDetail: true,
      children: <CouponDetail initialValues={detail}></CouponDetail>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: shwo,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['franchiseApp/fetchFranchiseHandle'],
}))(CouponDrawer);
