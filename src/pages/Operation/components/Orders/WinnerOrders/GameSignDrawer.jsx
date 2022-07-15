import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GameSignPushSet from './GameSignPushSet';
import GameSignDetail from './GameSignDetail';

const GameSignDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading, loadings } = props;

  const { type = 'info', show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  useEffect(() => {
    show && type == 'add' && dispatch({ type: 'baseData/fetchListExpressCompany' });
  }, [show]);

  //提交发货
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      const { logisticsCompany, logisticsNum, companyCode } = value;
      dispatch({
        type: 'boxLottery/fetchDeliveryUserPackage',
        payload: {
          companyCode,
          logisticsInfo: `${logisticsCompany} | ${logisticsNum}`,
          userPackageId: detail.userPackageId,
          userId: detail.userId,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 新增修改公共处理
  const addEditProps = {
    children: <GameSignPushSet form={form} initialValues={detail}></GameSignPushSet>,
    footer: (
      <>
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          发货
        </Button>
      </>
    ),
  };

  // 统一处理
  const drawerProps = {
    add: {
      title: '发货',
      ...addEditProps,
    },
    info: {
      title: '查看物流',
      children: <GameSignDetail initialValues={detail}></GameSignDetail>,
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: `${drawerProps.title}`,
    visible: show,
    loading: type == 'info' && loadings.effects['refundOrder/fetchGetExpressInfo'],
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['boxlottery/fetchDeliveryUserPackage'],
  loadings: loading,
}))(GameSignDrawer);
