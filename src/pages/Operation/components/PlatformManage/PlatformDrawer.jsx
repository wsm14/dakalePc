import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import CouponDetail from './Detail/CouponDetail';
import PlatformSet from './Form/PlatformSet';

const CouponDrawer = (props) => {
  const { visible, dispatch, total, childRef, onClose, getDetail, loading, loadingDetail } = props;

  const { type = 'info', platformCouponId, show = false, detail = {} } = visible;
  const [ticket, setTicket] = useState('goodsBuy'); // 券使用场景类型
  const [citys, setCitys] = useState([]);

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      console.log('values', values);

      const {
        activeDate,
        ruleType,
        personLimit,
        dayMaxBuyAmount,
        ruleCondition,
        consortUserOs,
        apply = [],
        cityCode,
        ...other
      } = values;

      return;
      dispatch({
        type: {
          add: 'platformCoupon/fetchPlatformCouponSave',
          edit: 'couponManage/fetchCouponUpdate',
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
          ruleConditionObjects: [
            {
              ruleType:
                ruleCondition == '0' || ruleCondition == '1'
                  ? 'availableAreaRule'
                  : 'unavailableAreaRule',
              ruleConditionList:
                ruleCondition == '0'
                  ? { condition: 'all' }
                  : citys.map((item) => ({
                      condition: item,
                    })),
            },
          ],
          consortUserOs: apply.join(',') || consortUserOs,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  const listProp = {
    ticket,
    setTicket,
    citys,
    setCitys,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看详情',
      children: <CouponDetail detail={detail}></CouponDetail>,
    },
    add: {
      title: '新建平台券',
      children: <PlatformSet {...listProp} form={form} initialValues={detail}></PlatformSet>,
    },
    edit: {
      title: '编辑券',
      children: <PlatformSet {...listProp} form={form} initialValues={detail}></PlatformSet>,
    },
    again: {
      title: '重新发布',
      children: <PlatformSet {...listProp} form={form} initialValues={detail}></PlatformSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    closeCallBack: () => dispatch({ type: 'baseData/clearGroupMre' }), // 关闭清空搜索的商家数据
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
