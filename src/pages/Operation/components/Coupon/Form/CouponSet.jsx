import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { connect } from 'umi';
import { Button } from 'antd';
import {
  BUSINESS_TYPE,
  COUPON_BUY_FLAG,
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_BUY_RULE,
  SPECIAL_USERTIME_TYPE,
} from '@/common/constant';
import { NUM_ALL, NUM_INT } from '@/common/regExp';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import { DescSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const CouponSet = ({ form, loading, selectList, skuMerchantList, dispatch }) => {
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ name: '', type: 'merchant', keys: [], list: [] }); // 店铺备选参数，选择店铺后回显的数据
  const [radioData, setRadioData] = useState({
    shopType: '0', // 店铺范围
    buyFlag: '0', // 是否售卖
    userFlag: '0', // 使用门槛
    userTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
  });

  // 设置form表单值 店铺id
  useEffect(() => {
    form.setFieldsValue({ merchantIdList: mreList.keys });
  }, [mreList.keys]);

  // 搜索店铺
  const fetchGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        name,
        type: mreList.type,
      },
    });
  }, 500);

  const saveMreData = (data) => setMreList({ ...mreList, ...data });

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      ellipsis: true,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      ellipsis: true,
    },
  ];

  // 信息
  const formItems = [
    {
      label: '选择店铺类型',
      type: 'radio',
      name: 'ownerType',
      select: BUSINESS_TYPE,
      onChange: (e) => {
        saveSelectData({ shopType: '0' });
        saveMreData({ type: e.target.value, ratio: 0, name: '', keys: [], list: [] }); // 重置已选店铺数据
        form.setFieldsValue({ ownerId: undefined, shopType: '0' }); // 重置数据
        dispatch({ type: 'businessList/close' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.type]}`,
      type: 'select',
      name: 'ownerId',
      placeholder: '请输入搜索',
      select: selectList,
      loading,
      onSearch: fetchGetMre,
      onChange: (val, data) => {
        const { option } = data;
        saveMreData({ name: option.name, ratio: option.commissionRatio, keys: [], list: [] });
      },
    },
    // {
    //   label: '店铺范围',
    //   type: 'radio',
    //   name: 'shopType',
    //   visible: mreList.name && mreList.type === 'group',
    //   select: ['全部', '部分'],
    //   onChange: (e) => saveSelectData({ shopType: e.target.value }),
    // },
    {
      label: '适用店铺',
      name: 'merchantIdList',
      type: 'formItem',
      visible: mreList.name && mreList.type == 'group',
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)}>
          选择店铺
        </Button>
      ),
    },
    {
      type: 'noForm',
      visible: mreList.name && mreList.type == 'group',
      formItem: (
        <MreSelectShow
          key="MreTable"
          form={form}
          columns={getColumns}
          rowKey="merchantId"
          {...mreList}
          setMreList={saveMreData}
        ></MreSelectShow>
      ),
    },
    {
      title: '设置券信息',
      label: '券名称',
      name: 'couponName',
      maxLength: 30,
    },
    {
      label: '券价值',
      name: ['reduceObject', 'couponPrice'],
      prefix: '￥',
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
    },
    {
      label: '售卖',
      name: 'buyFlag',
      type: 'radio',
      select: COUPON_BUY_FLAG,
      onChange: (e) => saveSelectData({ buyFlag: e.target.value }),
    },
    {
      label: '售卖价格',
      name: 'buyPrice',
      prefix: '￥',
      visible: radioData.buyFlag === '1',
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
    },
    {
      label: '商家结算价',
      name: 'merchantPrice',
      prefix: '￥',
      visible: radioData.buyFlag === '1',
      addRules: [
        { pattern: NUM_ALL, message: '价格必须为数字，且大于0' },
        {
          validator: (rule, value) => {
            const merchantPrice = Number(value);
            const buyPrice = Number(form.getFieldValue('buyPrice'));
            if (merchantPrice > buyPrice) {
              return Promise.reject('商家结算价不可超过售卖价格');
            }
            // “商家结算价不可超过N（结算价≤特惠价格*（1-费率））”
            const getPrice = buyPrice * (1 - mreList.ratio / 100);
            if (merchantPrice > getPrice) {
              return Promise.reject(`商家结算价不可超过${getPrice}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      title: '设置使用规则',
      label: '使用门槛',
      type: 'radio',
      select: ['无限制', '有限制'],
      name: 'restrictions',
      onChange: (e) => saveSelectData({ userFlag: e.target.value }),
    },
    {
      label: '门槛金额',
      name: ['reduceObject', 'thresholdPrice'],
      prefix: '￥',
      suffix: '元可使用',
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
      visible: radioData.userFlag === '1',
    },
    {
      label: '使用有效期',
      type: 'radio',
      select: SPECIAL_USERTIME_TYPE,
      name: 'useTimeRule',
      onChange: (e) => saveSelectData({ userTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'activeDate',
      type: 'rangePicker',
      visible: radioData.userTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '领取后生效天数',
      name: 'delayDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.userTime === 'gain',
    },
    {
      label: '有效期天数',
      name: 'activeDays',
      type: 'number',
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
      addRules: [{ pattern: NUM_INT, message: '投放总量必须为整数，且不可为0' }],
      suffix: '张',
    },
    {
      label: `${['领取', '购买'][radioData.buyFlag]}上限`,
      type: 'radio',
      name: 'buyRule',
      select: COUPON_BUY_RULE,
      onChange: (e) => saveSelectData({ buyRule: e.target.value }),
    },
    {
      label: `单人每人${['领取', '购买'][radioData.buyFlag]}份数`,
      name: 'personLimit',
      suffix: '份',
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'personLimit',
    },
    {
      label: `单人每天${['领取', '购买'][radioData.buyFlag]}份数`,
      name: 'dayMaxByAmount',
      suffix: '份',
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'dayLimit',
    },
    {
      label: '是否允许随时退款',
      visible: radioData.buyFlag === '1',
      type: 'switch',
      name: ['reduceObject', 'anytimeRefund'],
    },
    {
      label: '是否允许过期退款',
      visible: radioData.buyFlag === '1',
      type: 'switch',
      name: ['reduceObject', 'expireRefund'],
    },
    {
      title: '使用说明',
      label: '使用说明',
      name: 'couponDesc',
      type: 'formItem',
      formItem: <DescSet name={'couponDesc'}></DescSet>,
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={{ ownerType: 'merchant' }}
      ></FormCondition>
      <MreSelect
        dispatchType={'baseData/fetchSkuAvailableMerchant'}
        rowKey="merchantId"
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        params={{ groupId: mreList.groupId }}
        onOk={saveMreData}
        onCancel={() => setVisible(false)}
        columns={getColumns}
        searchShow={false}
        list={skuMerchantList}
      ></MreSelect>
    </>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.groupMreList,
  skuMerchantList: baseData.skuMerchantList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(CouponSet);
