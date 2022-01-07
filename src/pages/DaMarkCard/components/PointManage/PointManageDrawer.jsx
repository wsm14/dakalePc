import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import PointManageDetail from './Detail/PlatformDetail';
import PointManageSet from './Form/PlatformSet';

const PointManageDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'info', platformCouponId, show = false, detail = {} } = visible;
  const [ticket, setTicket] = useState('goodsBuy'); // 券使用场景类型
  const [citys, setCitys] = useState([]); // 暂存选择的所有城市

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      console.log('values', values);
      // return;
      const { districtCode, distanceFlag, range, ...other } = values;

      dispatch({
        type: {
          add: 'pointManage/fetchSaveHittingMain',
          edit: 'platformCoupon/fetchPlatformCouponUpdate',
        }[type],
        payload: {
          ...other,
          provinceCode: districtCode.slice(0, 2),
          cityCode: districtCode.slice(0, 4),
          districtCode,
          distanceFlag,
          range: distanceFlag === '0' ? '999999999' : range,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const listProp = {};
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '主体详情',
      children: <PointManageDetail detail={detail}></PointManageDetail>,
    },
    add: {
      title: '新建主体',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
    },
    edit: {
      title: '编辑主体',
      children: <PointManageSet {...listProp} form={form} initialValues={detail}></PointManageSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    footer: ['add', 'edit'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        新增
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['platformCoupon/fetchPlatformCouponSave'] ||
    loading.effects['platformCoupon/fetchPlatformCouponUpdate'],
  loadingDetail: loading.effects['platformCoupon/fetchGetPlatformCouponDetail'],
}))(PointManageDrawer);
