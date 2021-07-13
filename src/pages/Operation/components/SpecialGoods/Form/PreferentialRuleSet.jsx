import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  COUPON_BUY_RULE,
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_ACTIVE_TYPE,
  SPECIAL_USERTIME_TYPE,
} from '@/common/constant';
import { NUM_INT_MAXEIGHT } from '@/common/regExp';
import { DescSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const PreferentialRuleSet = ({ form, editActive, initialValues = {} }) => {
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive);

  const [radioData, setRadioData] = useState({
    activeTime: '', // 活动时间
    userTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
    disabledDate: [], // 限制时间
  });

  useEffect(() => {
    const {
      buyRule,
      timeType,
      timeSplit,
      activityTimeRule: activeTime,
      useTimeRule: userTime,
    } = initialValues;
    saveSelectData({ buyRule, timeType, timeSplit, activeTime, userTime });
  }, []);

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 信息
  const formItems = [
    {
      title: '设置投放规则',
      label: '活动时间',
      type: 'radio',
      select: COUPON_ACTIVE_TYPE,
      disabled: editDisabled,
      name: 'activityTimeRule',
      onChange: (e) => saveSelectData({ activeTime: e.target.value }),
    },
    {
      label: '设置时间',
      name: 'activityStartTime',
      type: 'rangePicker',
      disabled: editDisabled,
      visible: radioData.activeTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      onChange: (val) => form.setFieldsValue({ activeDate: undefined }),
    },
    {
      label: '使用有效期',
      type: 'radio',
      select: SPECIAL_USERTIME_TYPE,
      name: 'useTimeRule',
      disabled: editDisabled,
      onChange: (e) => saveSelectData({ userTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'useStartTime',
      type: 'rangePicker',
      disabled: editDisabled,
      visible: radioData.userTime === 'fixed',
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
      disabled: editDisabled,
      visible: radioData.userTime === 'gain',
    },
    {
      label: '有效期天数',
      name: 'activeDays',
      type: 'number',
      disabled: editDisabled,
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.userTime === 'gain',
    },
    {
      label: '适用时段',
      type: 'radio',
      select: COUPON_USER_TIME,
      name: 'timeSplit',
      onChange: (e) => saveSelectData({ timeSplit: e.target.value }),
    },
    {
      label: '每周',
      type: 'checkbox',
      select: COUPON_WEEK_TIME,
      name: 'useWeek',
      visible: radioData.timeSplit === 'part',
    },
    {
      label: '时间选择',
      type: 'radio',
      select: COUPON_TIME_TYPE,
      name: 'timeType',
      visible: radioData.timeSplit !== '',
      onChange: (e) => saveSelectData({ timeType: e.target.value }),
    },
    {
      label: '设置时间段',
      name: 'useTime',
      type: 'timePicker',
      order: false,
      visible: radioData.timeType === 'part',
    },
    {
      label: '投放总量',
      name: 'total',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '投放总量必须为整数，且不可为0' }],
      disabled: editDisabled,
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
      label: `单人${{ personLimit: '每人', dayLimit: '每天' }[radioData.buyRule]}购买份数`,
      name: { personLimit: 'maxBuyAmount', dayLimit: 'dayMaxBuyAmount' }[radioData.buyRule],
      suffix: '份',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '份数必须为整数，且不可为0' }],
      visible: ['personLimit', 'dayLimit'].includes(radioData.buyRule),
    },
    {
      label: '是否需要预约购买',
      type: 'switch',
      name: 'needOrder',
    },
    {
      label: '购买须知',
      name: 'buyDesc',
      type: 'formItem',
      formItem: <DescSet name={'buyDesc'}></DescSet>,
    },
    {
      title: '设置退款规则',
      label: '是否允许随时退款',
      type: 'switch',
      name: 'allowRefund',
    },
    {
      label: '是否允许过期退款',
      type: 'switch',
      name: 'allowExpireRefund',
    },
  ];

  return (
    <FormCondition
      form={form}
      formItems={formItems}
      initialValues={{ needOrder: 0, allowRefund: 0, allowExpireRefund: 0, ...initialValues }}
    ></FormCondition>
  );
};

export default PreferentialRuleSet;
