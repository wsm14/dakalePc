import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { NUM_INT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const MarketCardActivitySetCoupon = (props) => {
  const { dispatch, childRef, visible = {}, onClose, loading } = props;

  const [form] = Form.useForm();

  // addType true 新增 false 详情
  const { show = false, detail = {}, addType = true } = visible;
  const { marketCouponId, merchantName, activityId, couponChannels: coupon = '' } = detail;

  // 提交表单
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { mark, moment } = values;
      const couponBtn = [];
      if (mark) couponBtn.push('mark');
      if (moment) couponBtn.push('moment');
      dispatch({
        type: 'marketCardActivity/fetchMarketActivityCouponSet',
        payload: { ...values, marketCouponId, couponChannels: couponBtn.toString(), activityId },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const couponIndexOf = (val) => ({ true: '开启', false: '关闭' }[coupon.indexOf(val) > -1]);

  const formItems = [
    {
      label: '券类型',
      type: 'select',
      name: 'couponType',
      select: ['抵扣券'],
      disabled: true,
      render: () => '抵扣券',
    },
    {
      label: '券名称',
      name: 'couponName',
      maxLength: 20,
      render: (val) => val || '活动已下架，未添加',
    },
    {
      label: '券金额',
      type: 'number',
      name: 'couponValue',
      render: (val) => val || '活动已下架，未添加',
    },
    {
      label: '有效期',
      name: 'activeDays',
      extra: '输入天数，自领取成功之后该天数内有效',
      addonAfter: '天',
      addRules: [{ pattern: NUM_INT, message: '天数应为整数' }],
      render: (val) => (val ? `自领取成功之后 ${val} 天内有效` : '活动已下架，未添加'),
    },
    {
      title: '设置领券关联',
      label: '关联到店打卡',
      type: 'switch',
      name: 'mark',
      rules: [],
      render: () => couponIndexOf('mark'),
    },
    {
      label: '关联看分享',
      type: 'switch',
      name: 'moment',
      rules: [],
      render: () => couponIndexOf('moment'),
    },
  ];

  const modalProps = {
    title: `${addType ? '新增优惠券' : '查看优惠券'} - ${merchantName}`,
    visible: show,
    onClose,
    footer: addType && (
      <Button type="primary" onClick={fetchGetFormData} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {addType ? (
        <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      ) : (
        <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketCardActivity/fetchMarketActivityCouponSet'],
}))(MarketCardActivitySetCoupon);
