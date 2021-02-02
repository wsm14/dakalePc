import React from 'react';
import { connect } from 'umi';
import { Button, Form, Modal } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import DrawerCondition from '@/components/DrawerCondition';
import SaleAccountDetail from './Detail/SaleAccountDetail';
import SaleAccountSet from './Form/SaleAccountSet';

const SaleAccountDrawer = (props) => {
  const { dispatch, visible, childRef, setVisible, loading } = props;

  const [form] = Form.useForm();
  const { type = 'add', show = false, detail = {} } = visible;

  // 状态
  const { status, sellMainId } = detail;

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      const { password, contactMobile, agentCode } = values;
      dispatch({
        type: {
          add: 'saleAccount/fetchSaleAccountAdd',
          edit: 'saleAccount/fetchSaleAccountEdit',
        }[type],
        payload: {
          ...values,
          sellMainId, // 修改时存在
          agentCode: agentCode[agentCode.length - 1],
          password: password
            ? password
            : type == 'edit'
            ? undefined
            : contactMobile.match(/.*(.{6})/)[1],
        },
        callback: () => {
          setVisible(false);
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 修改状态
  const fetchSaleStatueEdit = (handle) => {
    Modal.confirm({
      title: `确认${{ status: { 0: '冻结', 1: '解冻' }[status], relieve: '解约' }[handle]}？`,
      onOk() {
        dispatch({
          type: 'saleAccount/fetchSaleAccountEdit',
          payload: {
            sellMainId: detail.sellMainId,
            status: { status: 1 ^ Number(status), relieve: 2 }[handle],
          },
          callback: () => {
            setVisible(false);
            childRef.current.fetchGetData();
          },
        });
      },
      onCancel() {},
    });
  };

  // 统一处理
  const drawerProps = {
    detail: {
      title: '查看详情',
      children: <SaleAccountDetail form={form} detail={detail}></SaleAccountDetail>,
      footer: (
        <>
          <AuthConsumer show={status !== '2'} auth="status">
            <Button onClick={() => fetchSaleStatueEdit('status')} type="primary" loading={loading}>
              {{ 0: '冻结', 1: '解冻' }[status]}
            </Button>
          </AuthConsumer>
          <AuthConsumer show={status !== '2'} auth="relieve">
            <Button onClick={() => fetchSaleStatueEdit('relieve')} type="primary" loading={loading}>
              解约
            </Button>
          </AuthConsumer>
          <AuthConsumer show={status !== '2'} auth="edit">
            <Button
              onClick={() => setVisible({ ...visible, type: 'edit' })}
              type="primary"
              loading={loading}
            >
              编辑
            </Button>
          </AuthConsumer>
        </>
      ),
    },
    add: {
      title: '新增账户',
      children: <SaleAccountSet form={form} detail={detail} type={type}></SaleAccountSet>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    edit: {
      title: '修改账户',
      onClose: () => setVisible({ ...visible, type: 'detail' }),
      children: <SaleAccountSet form={form} detail={detail} type={type}></SaleAccountSet>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          保存
        </Button>
      ),
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    bodyStyle: { paddingTop: type === 'detail' ? 24 : 0 },
    onClose: () => (drawerProps.onClose ? drawerProps.onClose() : setVisible(false)),
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.models.saleAccount,
}))(SaleAccountDrawer);
