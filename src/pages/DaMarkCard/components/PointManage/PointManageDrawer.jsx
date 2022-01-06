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
      // console.log('values', values);

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
    type,
    ticket,
    setTicket,
    citys,
    setCitys,
  };
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
