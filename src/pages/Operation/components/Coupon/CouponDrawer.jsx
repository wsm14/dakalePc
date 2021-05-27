import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import CouponDetail from './Detail/CouponDetail';
import CouponSet from './Form/CouponSet';

const CouponDrawer = (props) => {
  const { visible, dispatch, total, childRef, onClose, getDetail, loading, loadingDetail } = props;

  const { type = 'info', index, show = false, detail = {} } = visible;
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
        ...other
      } = values;
      dispatch({
        type: 'couponManage/fetchCouponSave',
        payload: {
          ...other,
          couponType: 'reduce',
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

  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看详情',
      children: <CouponDetail detail={detail}></CouponDetail>,
    },
    add: {
      title: '新建券',
      children: <CouponSet form={form} initialValues={detail}></CouponSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    closeCallBack: () => dispatch({ type: 'businessList/close' }), // 关闭清空搜索的商家数据
    dataPage: type === 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: type === 'add' && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        发布申请
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['couponManage/fetchCouponSave'],
  loadingDetail: loading.effects['couponManage/fetchCouponDetail'],
}))(CouponDrawer);
