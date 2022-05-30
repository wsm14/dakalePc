import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import SupplierBrandForm from './SupplierBrandForm';
import SupplierBrandDetail from './SupplierBrandDetail';

const SupplierBrandDrawer = (props) => {
  const {
    visible = {},
    dispatch,
    total,
    childRef,
    onClose,
    getDetail,
    supplierId,
    loading,
    loadingDetail,
  } = props;

  const { mode = 'info', index, show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { authorizeImg = '', timeData } = values;
      aliOssUpload(authorizeImg).then((res) => {
        dispatch({
          type: 'supplierManage/fetchSupplierBrandSet',
          payload: {
            mode,
            ...values,
            supplierId,
            supplierBrandId: detail.supplierBrandId,
            authorizeImg: res.toString(),
            startDate: timeData[0].format('YYYY-MM-DD HH:mm'),
            endDate: timeData[1].format('YYYY-MM-DD HH:mm'),
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
      children: <SupplierBrandDetail detail={detail}></SupplierBrandDetail>,
    },
    add: {
      title: '新增品牌',
      children: <SupplierBrandForm form={form}></SupplierBrandForm>,
    },
    edit: {
      title: '编辑品牌',
      children: <SupplierBrandForm form={form} initialValues={detail}></SupplierBrandForm>,
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

export default connect(({ loading, supplierManage }) => ({
  total: supplierManage.brandList.list.length,
  loading: loading.effects['supplierManage/fetchSupplierBrandSet'],
  loadingDetail: loading.effects['supplierManage/fetchSupplierBrandDetail'],
}))(SupplierBrandDrawer);
