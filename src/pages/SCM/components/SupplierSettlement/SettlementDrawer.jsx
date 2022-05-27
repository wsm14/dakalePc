import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import SettlementEdit from './Form/SettlementEdit';
import SettlementDetail from './Detail/SettlementDetail';

const SupplierSettlementDrawer = (props) => {
  const {
    visible = {},
    dispatch,
    total,
    childRef,
    onClose,
    getDetail,
    loading,
    loadingDetail,
  } = props;

  const { mode = 'info', index, show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { certificate = '', payerAccount, settleTime } = values;
      aliOssUpload(certificate).then((res) => {
        dispatch({
          type: {
            add: 'supplierSettlement/fetchSupplierSettlementAdd',
            edit: 'supplierSettlement/fetchSupplierSettlementEdit',
          }[mode],
          payload: {
            ...values,
            supplierSettlementId: detail.supplierSettlementId,
            certificate: res.toString(),
            payerAccount: payerAccount.replace(/\s*/g, ''),
            settleTime: settleTime.format('YYYY-MM-DD HH:mm'),
          },
          callback: () => {
            childRef.current.fetchGetData();
            onClose();
          },
        });
      });
    });
  };

  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看详情',
      children: <SettlementDetail detail={detail}></SettlementDetail>,
    },
    add: {
      title: '新增结算',
      children: (
        <SettlementEdit
          initialValues={{
            settleTime: moment(),
          }}
          form={form}
        ></SettlementEdit>
      ),
    },
    edit: {
      title: '编辑结算',
      children: <SettlementEdit form={form} initialValues={detail}></SettlementEdit>,
    },
  }[mode];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    dataPage: mode === 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: ['add', 'edit'].includes(mode) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading, supplierSettlement }) => ({
  total: supplierSettlement.list.length,
  loading:
    loading.effects['supplierSettlement/fetchSupplierSettlementAdd'] ||
    loading.effects['supplierSettlement/fetchSupplierSettlementEdit'],
  loadingDetail: loading.effects['supplierSettlement/fetchGetSupplierSettlementDetail'],
}))(SupplierSettlementDrawer);
