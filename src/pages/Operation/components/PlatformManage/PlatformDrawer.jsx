import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import PlatformDetail from './Detail/PlatformDetail';
import PlatformSet from './Form/PlatformSet';

const CouponDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'info', platformCouponId, show = false, detail = {} } = visible;
  const [ticket, setTicket] = useState('goodsBuy'); // 券使用场景类型

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      // console.log('values', values);
      // return;

      const {
        activeDate,
        ruleType,
        personLimit,
        dayMaxBuyAmount,
        apply = [],
        cityCode,
        increaseRule,
        beanNum,
        maxValue,
        ruleList,
        ...other
      } = values;

      // return;
      dispatch({
        type: {
          add: 'platformCoupon/fetchPlatformCouponSave',
          edit: 'platformCoupon/fetchPlatformCouponUpdate',
        }[type],
        payload: {
          platformCouponId,
          ...other,
          couponType: 'fullReduce',
          activeDate: activeDate && activeDate[0].format('YYYY-MM-DD'),
          endDate: activeDate && activeDate[1].format('YYYY-MM-DD'),
          getRuleObject: {
            ruleType,
            personLimit,
            dayMaxBuyAmount,
          },
          increaseRuleObject: increaseRule === '1' && {
            type: 'bean',
            beanNum,
            maxValue,
          },
          ruleList: ruleList.map((item) => ({
            ruleId: item.ruleId,
          })),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const listProp = {
    type,
    ticket,
    setTicket,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '平台券详情',
      children: <PlatformDetail detail={detail}></PlatformDetail>,
    },
    add: {
      title: '新建平台券',
      children: <PlatformSet {...listProp} form={form} initialValues={detail}></PlatformSet>,
    },
    edit: {
      title: '编辑平台券',
      children: <PlatformSet {...listProp} form={form} initialValues={detail}></PlatformSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    closeCallBack: () => {
      setTicket('goodsBuy');
    },
    footer: ['add', 'edit'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        保存
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
}))(CouponDrawer);
