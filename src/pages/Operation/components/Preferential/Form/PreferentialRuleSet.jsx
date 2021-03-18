import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form, Checkbox } from 'antd';
import {
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_BUY_RULE,
} from '@/common/constant';
import { NUM_INT_MAXEIGHT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const PreferentialRuleSet = ({ visible, loading, onClose, dispatch }) => {
  const { show = false, preData } = visible;

  const [form] = Form.useForm();
  const [treaty, setTreaty] = useState(false); // 是否同意协议
  const [radioData, setRadioData] = useState({
    activeTime: '', // 活动时间
    userTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
    disabledDate: [], // 限制时间
  });

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 信息
  const formItems = [
    {
      title: '设置投放规则',
      label: '活动时间',
      type: 'radio',
      select: ['长期', '固定时间'],
      name: 'setTsdime',
      onChange: (e) => saveSelectData({ activeTime: e.target.value }),
    },
    {
      label: '设置时间',
      name: 'actsdiveDate',
      type: 'rangePicker',
      visible: radioData.activeTime === '1',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      onChange: (val) => form.setFieldsValue({ activeDate: undefined }),
    },
    {
      label: '使用有效期',
      type: 'radio',
      select: ['固定时间', '领取后'],
      name: 'setTime',
      onChange: (e) => saveSelectData({ userTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'activeDate',
      type: 'rangePicker',
      visible: radioData.userTime === '0',
      disabledDate: (time) => {
        const dates = form.getFieldValue('actsdiveDate');
        const noewdate = moment().endOf('day').subtract(1, 'day');
        if (!dates || dates.length === 0) return time < noewdate;
        const tooLate = dates[0] && time < dates[0];
        return tooLate;
      },
      onCalendarChange: (val) => saveSelectData({ disabledDate: val }),
      addRules: [
        {
          validator: (rule, time) => {
            const dates = form.getFieldValue('actsdiveDate');
            if (dates && time && time[1] < dates[1]) {
              return Promise.reject('有效期结束时间必须大于活动时间');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '领取后生效天数',
      name: 'delayDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.userTime === '1',
    },
    {
      label: '有效期天数',
      name: 'activeDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.userTime === '1',
    },
    {
      label: '适用时段',
      type: 'radio',
      select: COUPON_USER_TIME,
      name: ['availableTime', 'dayType'],
      onChange: (e) => saveSelectData({ timeSplit: e.target.value }),
    },
    {
      label: '每周',
      type: 'checkbox',
      select: COUPON_WEEK_TIME,
      name: ['availableTime', 'weekDays'],
      visible: radioData.timeSplit === 'part',
    },
    {
      label: '时间选择',
      type: 'radio',
      select: COUPON_TIME_TYPE,
      name: ['availableTime', 'timeType'],
      visible: radioData.timeSplit !== '',
      onChange: (e) => saveSelectData({ timeType: e.target.value }),
    },
    {
      label: '设置时间段',
      name: 'timeRange',
      type: 'timePicker',
      order: false,
      visible: radioData.timeType === 'part',
    },
    {
      label: '投放总量',
      name: 'total',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '投放总量必须为整数，且不可为0' }],
      suffix: '份',
    },
    {
      title: '设置购买规则',
      label: '购买上限',
      type: 'radio',
      name: 'buyRule',
      select: COUPON_BUY_RULE,
      onChange: (e) => saveSelectData({ buyRule: e.target.value }),
    },
    {
      label: `单人每人购买份数`,
      name: 'personLimit',
      suffix: '份',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'personLimit',
    },
    {
      label: `单人每天购买份数`,
      name: 'dayMaxByAmount',
      suffix: '份',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'dayLimit',
    },
    {
      label: '是否需要预约购买',
      type: 'switch',
      name: ['reduceObject', 'anssnd'],
      normalize: (val) => Number(val),
      rules: [{ required: false }],
    },
    {
      label: '购买须知',
      type: 'textArea',
      name: 'couponDesc',
      maxLength: 200,
    },
    {
      title: '设置退款规则',
      label: '是否允许随时退款',
      type: 'switch',
      name: ['reduceObject', 'anytimeRefund'],
      normalize: (val) => Number(val),
      rules: [{ required: false }],
    },
    {
      label: '是否允许过期退款',
      type: 'switch',
      name: ['reduceObject', 'expireRefund'],
      normalize: (val) => Number(val),
      rules: [{ required: false }],
    },
  ];

  // 弹窗属性
  const modalProps = {
    title: '规则设置',
    visible: show,
    onClose,
    maskShow: false,
    footer: (
      <Button type="primary" loading={loading}>
        发布申请
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={{ ownerType: 'merchant', goodsType: 'single', groupGoods: [{}] }}
      ></FormCondition>
      <div style={{ textAlign: 'center' }}>
        <Checkbox onChange={(e) => setTreaty(e.target.checked)}>我已阅读并同意</Checkbox>
        <a>《商家营销协议》</a>
      </div>
    </DrawerCondition>
  );
};

export default connect(({ businessList, loading }) => ({
  selectList: businessList.selectList,
  loading: loading.models.businessList,
}))(PreferentialRuleSet);
