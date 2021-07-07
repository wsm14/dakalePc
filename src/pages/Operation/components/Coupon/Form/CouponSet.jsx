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

const CouponSet = (props) => {
  const {
    form,
    loading,
    selectList,
    skuMerchantList,
    dispatch,
    commissionShow,
    setCommissionShow,
    initialValues,
  } = props;
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  // 店铺备选参数，选择店铺后回显的数据
  const [mreList, setMreList] = useState({
    groupId: null,
    type: 'merchant',
    keys: [],
    list: [],
  }); // 店铺备选参数，选择店铺后回显的数据
  const [radioData, setRadioData] = useState({
    buyFlag: '0', // 是否售卖
    userFlag: '0', // 使用门槛
    effectTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
  });
  const {
    buyFlag,
    timeSplit = '',
    useTimeRule = '', //使用有效期
    buyRule = 'all', // 购买规则
    useTime = '',
    useWeek = '',
    reduceObject = {},
  } = initialValues;

  useEffect(() => {
    if (initialValues.ownerCouponIdString) {
      const timeTypeCheck = useTime === '00:00-23:59' ? useTime : 'part';
      const useWeekCheck = useWeek === '1,2,3,4,5,6,7' ? useWeek : 'part';
      const userFlagCheck = !reduceObject.thresholdPrice ? '0' : '1'; // 使用门槛

      initialValues.restrictions = userFlagCheck; // 使用门槛
      initialValues.timeSplit = useWeekCheck; // 适用时段
      initialValues.timeType = timeTypeCheck; // 使用时间 小时
      initialValues.useWeek = useWeekCheck === 'part' ? useWeek.split('-') : []; // 使用时间 周

      const times = useTime.split('-');
      initialValues.useTime =
        timeTypeCheck === 'part' ? [moment(times[0], 'HH:mm'), moment(times[1], 'HH:mm')] : [];
  
      // 适用时段
      setRadioData({
        buyFlag,
        userFlag: userFlagCheck, //详情无返回//使用门槛
        effectTime: useTimeRule ? useTimeRule : '',
        timeSplit,
        timeType: timeTypeCheck,
        buyRule,
      });

      if (initialValues.ownerName || initialValues.ownerType) {
        setMreList({
          type: initialValues.ownerType,
          groupId: initialValues.ownerId,
        });
        // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/平台标签
        fetchGetMre(initialValues.ownerName, initialValues.ownerType, (list = []) => {
          const mreFindIndex = list.findIndex((item) => item.value === initialValues.ownerId);
          const topCategoryId = list[mreFindIndex].topCategoryId[0];
          // 是否分佣
          getCommissionFlag(topCategoryId);
        });
        if (initialValues.ownerType === 'group') {
          getMerchantList();
        }
      }
    }
  }, [initialValues]);

  // 设置form表单值 店铺id
  useEffect(() => {
    form.setFieldsValue({ merchantIds: mreList.keys });
  }, [mreList.keys]);

  console.log(mreList.type, 'ddddd');

  //sku通用-sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: initialValues.specialGoodsId,
        ownerId: initialValues.ownerIdString,
        serviceType: 'specialGoods',
      },
      callback: (list) => {
        const keys = list.map((item) => item.merchantId);
        saveMreData({ keys: keys, list: list });
        form.setFieldsValue({ merchantIds: keys });
      },
    });
  };

  // 搜索店铺
  const fetchGetMre = debounce((name, type, callback) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        name,
        type: type || mreList.type,
      },
      callback,
    });
  }, 100);

  const saveMreData = (data) => setMreList((old) => ({ ...old, ...data }));

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  //sku通用-是否需要设置佣金
  const getCommissionFlag = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsIsCommission',
      payload: {
        serviceType: 'specialGoods',
        categoryId: categoryId,
      },
      callback: (val) => setCommissionShow(val),
    });
  };

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
        setCommissionShow(false);
        saveMreData({
          type: e.target.value,
          groupId: null,
          ratio: 0,
          keys: [],
          list: [],
        }); // 重置已选店铺数据
        form.setFieldsValue({ ownerId: undefined }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
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
        console.log(option, 'option');
        setCommissionShow(false);
        //是否分佣
        getCommissionFlag(option.topCategoryId[0]);
        form.setFieldsValue({ merchantIds: undefined });
        saveMreData({
          groupId: val,
          ratio: option.commissionRatio,
          keys: [],
          list: [],
        });
      },
    },

    {
      label: '适用店铺',
      name: 'merchantIds',
      type: 'formItem',
      visible: mreList.type == 'group',
      rules: [{ required: true, message: '请选择店铺' }],
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)}>
          选择店铺
        </Button>
      ),
    },
    {
      type: 'noForm',
      visible: mreList.type == 'group',
      formItem: (
        <MreSelectShow
          key="MreTable"
          form={form}
          rowKey="merchantId"
          columns={getColumns}
          {...mreList}
          setMreList={(val) => {
            saveMreData(val);
            form.setFieldsValue({ merchantIds: val.keys });
          }}
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
      select: COUPON_BUY_FLAG, // ['关闭', '开启'] 0--1
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
      label: '佣金总额', // 手动分佣需要展示
      name: 'commission',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      visible: commissionShow == '1',
      formatter: (value) => `￥ ${value}`,
      rules: [{ required: false }],
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
      select: SPECIAL_USERTIME_TYPE, //{ fixed: '固定时间', gain: '领取后' }
      name: 'useTimeRule',
      onChange: (e) => saveSelectData({ effectTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'activeDate',
      type: 'rangePicker',
      visible: radioData.effectTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '领取后生效天数',
      name: 'delayDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.effectTime === 'gain',
    },
    {
      label: '有效期天数',
      name: 'activeDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.effectTime === 'gain',
    },
    {
      label: '适用时段',
      type: 'radio',
      select: COUPON_USER_TIME, //1,2,3,4,5,6,7': '每天', part: '部分'
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
      select: COUPON_TIME_TYPE, // { '00:00-23:59': '全天', part: '固定时间' };
      name: 'timeType',
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
      select: COUPON_BUY_RULE, // { unlimited: '不限', personLimit: '每人限制', dayLimit: '每天限制' };
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
      name: 'dayMaxBuyAmount',
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
      formItem: <DescSet name={'couponDesc'} form={form}></DescSet>,
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues || { ownerType: 'merchant' }}
      ></FormCondition>
      <MreSelect
        dispatchType={'baseData/fetchSkuAvailableMerchant'}
        rowKey="merchantId"
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        params={{ groupId: mreList.groupId }}
        onOk={(val) => {
          saveMreData(val);
          form.setFieldsValue({ merchantIds: val.keys });
        }}
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
