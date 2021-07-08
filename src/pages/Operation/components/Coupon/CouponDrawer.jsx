import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import CouponDetail from './Detail/CouponDetail';
import CouponSet from './Form/CouponSet';

const CouponDrawer = (props) => {
  const { visible, dispatch, total, childRef, onClose, getDetail, loading, loadingDetail } = props;

  const {
    type = 'info',
    index,
    show = false,
    detail = {},
    ownerCouponId,
    ownerId,
    status,
  } = visible;
  const [commissionShow, setCommissionShow] = useState(false);
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      const {
        activeDate,
        restrictions,
        couponDesc = [],
        timeSplit,
        timeType,
        useWeek,
        useTime,
        merchantIds = [],
        ...other
      } = values;

      dispatch({
        type: {
          add: 'couponManage/fetchCouponSave',
          edit: 'couponManage/fetchCouponUpdate',
          again: 'couponManage/fetchCouponSave',
        }[type],
        payload: {
          ownerCouponId,
          ownerId,
          ...other,
          couponType: 'reduce',
          merchantIds: merchantIds.toString(),
          activeDate: activeDate && activeDate[0].format('YYYY-MM-DD'),
          endDate: activeDate && activeDate[1].format('YYYY-MM-DD'),
          useWeek: timeSplit !== 'part' ? timeSplit : useWeek.toString(),
          couponDesc: couponDesc.filter((i) => i),
          useTime:
            timeType !== 'part'
              ? timeType
              : `${useTime[0].format('HH:mm')}-${useTime[1].format('HH:mm')}`,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  const listProp = { commissionShow, setCommissionShow, type, status, ownerCouponId,
    ownerId, };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看详情',
      children: <CouponDetail detail={detail}></CouponDetail>,
    },
    add: {
      title: '新建券',
      children: <CouponSet {...listProp} form={form} initialValues={detail}></CouponSet>,
    },
    edit: {
      title: '编辑券',
      children: <CouponSet {...listProp} form={form} initialValues={detail}></CouponSet>,
    },
    again: {
      title: '重新发布',
      children: <CouponSet {...listProp} form={form} initialValues={detail}></CouponSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    closeCallBack: () => dispatch({ type: 'baseData/clearGroupMre' }), // 关闭清空搜索的商家数据
    dataPage: type === 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: ['add', 'edit', 'again'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        发布
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['couponManage/fetchCouponSave'],
  loadingDetail: loading.effects['couponManage/fetchCouponDetail'],
}))(CouponDrawer);
