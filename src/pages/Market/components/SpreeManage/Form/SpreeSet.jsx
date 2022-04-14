import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { COUPON_BUY_RULE } from '@/common/constant';
import { NUM_ALL, NUM_INT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from '../ShareCoupon/ShareCoupon';

const CouponSet = (props) => {
  const { form, type, initialValues, giftTypeList } = props;

  const [radioData, setRadioData] = useState({
    getLimit: 'unlimited', // 领取上限
    spreePrice: '0', // 礼包价格
  });
  const { ruleType, buyFlagType } = initialValues;

  useEffect(() => {
    if (initialValues.platformGiftId) {
      setRadioData({
        getLimit: ruleType, // 领取上限
        spreePrice: buyFlagType, // 礼包价格
      });
    }
  }, [initialValues]);

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 信息
  const formItems = [
    {
      label: '礼包类型',
      type: 'select',
      name: 'giftTypeId',
      disabled: type === 'edit',
      select: giftTypeList,
      fieldNames: {
        label: 'typeValue',
        value: 'giftTypeId',
      },
    },
    {
      label: '礼包名称',
      name: 'giftName',
      maxLength: 15,
    },
    {
      label: '领取价格',
      type: 'radio',
      disabled: type === 'edit',
      name: 'buyFlagType',
      // select: ['免费', '有价', '卡豆+现金'],
      select: ['免费', false, '卡豆+现金'],
      onChange: (e) => saveSelectData({ spreePrice: e.target.value }),
    },
    {
      label: '卡豆数',
      name: 'bean',
      disabled: type === 'edit',
      type: 'number',
      visible: radioData.spreePrice == '2',
      max: 999999,
      min: 0,
      precision: 0,
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
    },
    {
      label: '现金数',
      name: 'buyPriceCash',
      type: 'number',
      disabled: type === 'edit',
      visible: radioData.spreePrice != '0',
      addonBefore: '￥',
      max: 999999,
      min: 0,
      precision: 2,
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
      placeholder: '请输入价格',
    },
    {
      label: '礼包价值',
      name: 'giftValue',
      type: 'number',
      disabled: type === 'edit',
      addonBefore: '￥',
      max: 999999,
      min: 0,
      precision: 2,
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
    },
    {
      label: '礼包内容',
      name: 'platformGiftPackRelateList',
      disabled: type === 'edit',
      type: 'formItem',
      required: true,
      formItem: (
        <>
          <ShareCoupon
            type="platformGiftPackRelateList"
            handleType={type}
            form={form}
          ></ShareCoupon>
        </>
      ),
    },
    {
      label: '礼包数量',
      name: 'total',
      type: 'number',
      disabled: type === 'edit',
      max: 999999999,
    },
    {
      label: '发放时间段 ',
      disabled: type === 'edit',
      type: 'rangePicker',
      name: 'activeDate',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '领取上限',
      type: 'radio',
      name: 'ruleType',
      select: COUPON_BUY_RULE, // { unlimited: '不限', personLimit: '每人限制', dayLimit: '每天限制' };
      disabled: type === 'edit',
      onChange: (e) => saveSelectData({ getLimit: e.target.value }),
    },
    {
      label: `单人每人限制领取`,
      name: 'personLimit',
      type: 'number',
      addonBefore: '每人限制领取',
      addonAfter: '张',
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.getLimit === 'personLimit',
      disabled: type === 'edit',
    },
    {
      label: `单人每天限制领取`,
      name: 'dayMaxBuyAmount',
      type: 'number',
      addonBefore: '每人每天限制领取',
      addonAfter: '张',
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.getLimit === 'dayLimit',
      disabled: type === 'edit',
    },
    {
      label: '其他说明',
      type: 'textArea',
      name: 'otherDesc',
      maxLength: 100,
      rules: [{ required: false }],
    },
  ];

  const formProps = {
    buyFlagType: '0',
    ruleType: 'unlimited',
  };
  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={{ ...formProps, ...initialValues }}
      ></FormCondition>
    </>
  );
};

export default connect(({}) => ({}))(CouponSet);
