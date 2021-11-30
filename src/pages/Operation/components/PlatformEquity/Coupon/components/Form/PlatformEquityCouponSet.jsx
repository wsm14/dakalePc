import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { connect } from 'umi';
import { Button } from 'antd';
import {
  BUSINESS_TYPE,
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_BUY_RULE,
  PEQUITY_GOODSBUY_TYPE,
  SPECIAL_USERTIME_TYPE,
  COMMISSION_TYPE,
} from '@/common/constant';
import { NUM_ALL, NUM_INT } from '@/common/regExp';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import { DescSet } from '@/components/FormListCondition';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';

const PlatformEquityCouponSet = (props) => {
  const {
    form,
    loading,
    selectList,
    skuMerchantList,
    dispatch,
    buyFlag,
    setBuyFlag,
    commissionShow,
    setCommissionShow,
    ownerCouponId,
    initialValues,
    type,
    status,
    setContent,
  } = props;

  // 是否 编辑重新发布（上架，下架）都隐藏的数据
  const commonDisabled = ['edit', 'again'].includes(type) && ['1', '2'].includes(status);
  //活动中隐藏的编辑项//edit 且为上架中 独有不展示
  const editDisabled = type === 'edit' && status === '1';

  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [manualList, setManualList] = useState([]); // 分佣模版字段
  // 店铺备选参数，选择店铺后回显的数据
  const [mreList, setMreList] = useState({
    groupId: null,
    type: 'merchant',
    keys: [],
    list: [],
  }); // 店铺备选参数，选择店铺后回显的数据
  const [radioData, setRadioData] = useState({
    userFlag: '0', // 使用门槛
    effectTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
  });
  const {
    buyFlag: buyflagIV,
    useTimeRule = '', //使用有效期
    buyRule = 'all', // 购买规则
    timeTypeCheck = '',
    useWeekCheck = '',
    reduceObject = {},
  } = initialValues;

  useEffect(() => {
    if (initialValues.ownerCouponIdString) {
      const userFlagCheck = !reduceObject.thresholdPrice ? '0' : '1'; // 使用门槛
      initialValues.restrictions = userFlagCheck; // 使用门槛
      initialValues.timeSplit = useWeekCheck; // 适用时段
      initialValues.timeType = timeTypeCheck; // 使用时间 小时
      // 适用时段
      setRadioData({
        userFlag: userFlagCheck, //详情无返回//使用门槛
        effectTime: useTimeRule ? useTimeRule : '',
        timeSplit: useWeekCheck,
        timeType: timeTypeCheck,
        buyRule,
      });
      setBuyFlag(buyflagIV);
      if (initialValues.ownerName || initialValues.relateType) {
        setMreList({
          type: initialValues.relateType,
          groupId: initialValues.relateId,
        });
        // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/平台标签
        fetchGetMre(initialValues.relateName, initialValues.relateType, (list = []) => {
          const mreFindIndex = list.findIndex((item) => item.value === initialValues.relateId);
          const topCategoryId = list[mreFindIndex].topCategoryId[0];
          // 是否分佣
          getCommissionFlag(topCategoryId);
        });
        if (initialValues.relateType === 'group') {
          getMerchantList();
        }
      }
    }
  }, [initialValues.relateName]);

  // 设置form表单值 店铺id
  useEffect(() => {
    form.setFieldsValue({ merchantIds: mreList.keys });
  }, [mreList.keys]);

  //sku通用-sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: ownerCouponId,
        relateId: initialValues.relateId,
        ownerId: -1,
        serviceType: 'reduceCoupon',
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
        groupFlag: 0, // 不允许选择子门店
      },
      callback,
    });
  }, 100);

  const saveMreData = (data) => setMreList((old) => ({ ...old, ...data }));

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 查询店铺主体的费率
  const fetchCheckMreRate = (ownerId, type) => {
    dispatch({
      type: 'specialGoods/fetchCheckMreRate',
      payload: {
        ownerId,
        ownerType: type || mreList.type,
      },
      callback: ({ commissionRatio = 0 }) =>
        saveMreData({
          groupId: ownerId,
          ratio: commissionRatio,
          keys: [],
          list: [],
        }),
    });
  };

  //sku通用-是否需要设置佣金
  const getCommissionFlag = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsIsCommission',
      payload: {
        serviceType: 'rightCoupon',
        categoryId: categoryId,
      },
      callback: ({ manuallyFlag, manualDivisions = [] }) => {
        setCommissionShow(manuallyFlag);
        setManualList(manualDivisions);
      },
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
      name: 'relateType',
      select: BUSINESS_TYPE,
      disabled: commonDisabled,
      onChange: (e) => {
        setCommissionShow(false);
        saveMreData({
          type: e.target.value,
          groupId: null,
          ratio: 0,
          keys: [],
          list: [],
        }); // 重置已选店铺数据
        form.setFieldsValue({ relateId: undefined }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.type]}`,
      type: 'select',
      name: 'relateId',
      placeholder: '请输入搜索',
      select: selectList,
      disabled: commonDisabled,
      loading,
      onSearch: fetchGetMre,
      onChange: (val, data) => {
        const { option } = data;
        setCommissionShow(false);
        //是否分佣
        getCommissionFlag(option.topCategoryId[0]);
        fetchCheckMreRate(val);
        form.setFieldsValue({ merchantIds: undefined });
      },
    },

    {
      label: '适用店铺',
      name: 'merchantIds',
      type: 'formItem',
      visible: mreList.type == 'group',
      rules: [{ required: true, message: '请选择店铺' }],
      formItem: (
        <Button type="primary" ghost disabled={commonDisabled} onClick={() => setVisible(true)}>
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
          disabled={commonDisabled}
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
      maxLength: 80,
    },
    {
      label: '券价值',
      name: ['reduceObject', 'couponPrice'],
      prefix: '￥',
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
    },
    {
      label: '售卖类型',
      name: 'buyFlag',
      type: 'radio',
      disabled: commonDisabled,
      select: PEQUITY_GOODSBUY_TYPE,
      onChange: (e) => setBuyFlag(e.target.value),
    },
    {
      label: '售卖',
      name: ['paymentModeObject', 'type'],
      hidden: true,
    },
    {
      label: '卡豆数',
      name: ['paymentModeObject', 'bean'],
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999,
      visible: buyFlag == '1',
      suffix: '卡豆',
      disabled: commonDisabled,
    },
    {
      label: '现金（元）',
      name: ['paymentModeObject', 'cash'],
      type: 'number',
      precision: 2,
      min: 0.01,
      max: 999999.99,
      visible: buyFlag == '1',
      disabled: commonDisabled,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '平台结算价',
      name: 'merchantPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      visible: buyFlag == '1',
      formatter: (value) => `￥ ${value}`,
      addRules: [
        {
          validator: (rule, value) => {
            const merchantPrice = Number(value);
            const buyPrice = Number(form.getFieldValue('realPrice'));
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
      visible: commissionShow == '1' && buyFlag == '1',
      disabled: true,
      suffix: '元',
    },
    ...manualList.map((i) => ({
      label: `${COMMISSION_TYPE[i.divisionParticipantType]}`,
      name: ['serviceDivisionDTO', `${i.divisionParticipantType}Bean`],
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999,
      visible: buyFlag == '1' && commissionShow === '1',
      disabled: commonDisabled,
      suffix: '卡豆',
      onChange: () => {
        const keyArr = manualList.map((i) => [
          'serviceDivisionDTO',
          `${i.divisionParticipantType}Bean`,
        ]);
        const valObj = form.getFieldsValue(keyArr);
        const { serviceDivisionDTO = {} } = valObj;
        form.setFieldsValue({
          commission:
            Object.values(serviceDivisionDTO).reduce((pre, cur) => pre + Number(cur || 0), 0) / 100,
        });
      },
    })),
    {
      label: '介绍类型',
      name: 'couponDetailType',
      hidden: true,
    },
    {
      title: `设置优惠券介绍`,
      type: 'noForm',
      formItem: (
        <EditorForm
          content={initialValues.richText}
          editCallback={(val) => setContent(val)}
        ></EditorForm>
      ),
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
      disabled: editDisabled,
      select: SPECIAL_USERTIME_TYPE, //{ fixed: '固定时间', gain: '领取后' }
      name: 'useTimeRule',
      onChange: (e) => saveSelectData({ effectTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'activeDate',
      disabled: editDisabled,
      type: 'rangePicker',
      visible: radioData.effectTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '领取后生效天数',
      name: 'delayDays',
      type: 'number',
      disabled: editDisabled,
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.effectTime === 'gain',
    },
    {
      label: '有效期天数',
      name: 'activeDays',
      type: 'number',
      disabled: editDisabled,
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
      disabled: editDisabled,
      addRules: [{ pattern: NUM_INT, message: '投放总量必须为整数，且不可为0' }],
      suffix: '张',
    },
    {
      label: `${['领取', '购买'][buyFlag]}上限`,
      type: 'radio',
      name: 'buyRule',
      select: COUPON_BUY_RULE, // { unlimited: '不限', personLimit: '每人限制', dayLimit: '每天限制' };
      onChange: (e) => saveSelectData({ buyRule: e.target.value }),
    },
    {
      label: `单人每人${['领取', '购买'][buyFlag]}份数`,
      name: 'personLimit',
      suffix: '份',
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'personLimit',
    },
    {
      label: `单人每天${['领取', '购买'][buyFlag]}份数`,
      name: 'dayMaxBuyAmount',
      suffix: '份',
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'dayLimit',
    },
    {
      label: '是否允许随时退款',
      visible: buyFlag === '1',
      type: 'switch',
      name: ['reduceObject', 'anytimeRefund'],
    },
    {
      label: '是否允许过期退款',
      visible: buyFlag === '1',
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
        initialValues={initialValues || { relateType: 'merchant', couponDetailType: '0' }}
      ></FormCondition>
      <MreSelect
        dispatchType={'baseData/fetchSkuAvailableMerchant'}
        rowKey="merchantId"
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        pagination={false}
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
}))(PlatformEquityCouponSet);
