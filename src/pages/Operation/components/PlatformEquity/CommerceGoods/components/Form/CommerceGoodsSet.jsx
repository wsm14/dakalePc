import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { NUM_INT_MAXEIGHT } from '@/common/regExp';
import { COMMERCE_GOODSBUY_TYPE, COUPON_BUY_RULE, COMMISSION_TYPE } from '@/common/constant';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';

const CommerceGoodsSet = ({
  form,
  editActive,
  loading,
  selectList,
  dispatch,
  buyFlag,
  setBuyFlag, // 售卖价格
  commissionShow,
  setCommissionShow,
  initialValues = {},
  setContent,
}) => {
  // 是否 editActive = 'againUp' || 'again' || 'edit'三种都隐藏的数据
  const commonDisabled = ['againUp', 'again', 'edit'].includes(editActive);
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive);

  const [radioData, setRadioData] = useState({
    buyRule: 'unlimited', // 购买上限规则
  });
  const [manualList, setManualList] = useState([]); // 分佣模版字段

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  //编辑的时候数据回显的标签
  const { goodsTagList = [] } = initialValues;

  const goodsTags = goodsTagList
    .filter((item) => item.tagType === 'merchant')
    .map((key) => key.configGoodsTagId);
  initialValues.goodsTags = goodsTags;

  useEffect(() => {
    if (initialValues.relateName) {
      setBuyFlag(initialValues.buyFlag);
      saveSelectData({ buyRule: initialValues.buyRule });
      // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/商家商品标签
      fetchGetMre(initialValues.relateName, initialValues.relateType, (list = []) => {
        const mreFindIndex = list.findIndex((item) => item.value === initialValues.relateId);
        const topCategoryId = list[mreFindIndex].topCategoryId[0];
        // 是否分佣
        getCommissionFlag(topCategoryId);
      });
    }
  }, [initialValues.relateName]);

  // 搜索店铺
  const fetchGetMre = debounce((name, type, callback) => {
    console.log('name', name);
    console.log('type', type);
    console.log('callback', callback);
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        name,
        type: 'merchant',
        groupFlag: 0, // 不允许选择子门店
      },
      callback,
    });
  }, 100);

  //sku通用-是否需要设置佣金
  const getCommissionFlag = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsIsCommission',
      payload: {
        serviceType: 'commerceGoods',
        categoryId: categoryId,
      },
      callback: ({ manuallyFlag, manualDivisions }) => {
        setCommissionShow(manuallyFlag);
        setManualList(manualDivisions);
      },
    });
  };

  // 信息
  const formItems = [
    {
      label: `店铺`,
      type: 'select',
      name: 'relateId',
      placeholder: '请输入搜索',
      loading,
      select: selectList,
      disabled: commonDisabled,
      onSearch: fetchGetMre,
      onChange: (val, data) => {
        const { option } = data;
        setCommissionShow(false);
        getCommissionFlag(option.topCategoryId[0]);
        form.setFieldsValue({ merchantIds: undefined });
      },
    },
    {
      label: `商品轮播图`,
      name: 'activityGoodsImg',
      type: 'upload',
      maxFile: 5,
      maxSize: 500,
    },
    {
      label: `商品名称`,
      name: 'goodsName',
      maxLength: 80,
    },
    {
      label: `商品库存`,
      name: 'total',
      type: 'number',
      disabled: editDisabled,
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '投放总量必须为整数，且不可为0' }],
      suffix: '份',
    },
    {
      label: `购买上限`,
      name: 'buyRule',
      type: 'radio',
      select: COUPON_BUY_RULE,
      rules: [{ request: false }],
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
      title: '设置商品价格',
      label: '原价',
      name: 'oriPrice',
      type: 'number',
      disabled: editDisabled,
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
      suffix: '元',
    },
    {
      label: '成本价',
      name: 'costPrice',
      type: 'number',
      disabled: editDisabled,
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
      suffix: '元',
    },
    {
      label: '售卖价格',
      name: 'buyFlag',
      type: 'radio',
      disabled: commonDisabled,
      select: COMMERCE_GOODSBUY_TYPE,
      onChange: (e) => {
        form.setFieldsValue({
          paymentModeObject: {
            bean: 0,
          },
        });
        setBuyFlag(e.target.value);
      },
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
      disabled: commonDisabled,
      precision: 0,
      min: 0,
      max: 999999,
      visible: buyFlag == '1',
      suffix: '卡豆',
    },
    {
      label: '现金',
      name: ['paymentModeObject', 'cash'],
      type: 'number',
      disabled: commonDisabled,
      precision: 2,
      min: 0.01,
      max: 999999.99,
      // visible: buyFlag == '0',
      formatter: (value) => `￥ ${value}`,
      suffix: '元',
    },
    {
      label: '商家结算价',
      name: 'merchantPrice',
      type: 'number',
      disabled: editDisabled,
      precision: 2,
      min: 0.01,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
      suffix: '元',
      addRules: [
        {
          validator: (rule, value) => {
            const merchantPrice = Number(value);
            const buyPrice = Number(form.getFieldValue(['paymentModeObject', 'cash']));
            const buyPriceBean = Number(form.getFieldValue(['paymentModeObject', 'bean']));
            if (merchantPrice > buyPrice + buyPriceBean / 100) {
              return Promise.reject('商家结算价不可超过售卖价格');
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
      disabled: true,
      visible: commissionShow == '1',
      formatter: (value) => `￥ ${value}`,
      suffix: '元',
    },
    ...manualList.map((i) => ({
      label: `${COMMISSION_TYPE[i.divisionParticipantType]}`,
      name: ['serviceDivisionDTO', `${i.divisionParticipantType}Bean`],
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999,
      visible: commissionShow === '1',
      suffix: '卡豆',
      disabled: commonDisabled,
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
      name: 'goodsDescType',
      hidden: true,
    },
    {
      title: '设置商品介绍',
      type: 'noForm',
      formItem: (
        <EditorForm
          content={initialValues.richText}
          editCallback={(val) => setContent(val)}
        ></EditorForm>
      ),
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </>
  );
};

export default connect(({ baseData, loading, specialGoods }) => ({
  specialGoods,
  skuMerchantList: baseData.skuMerchantList,
  selectList: baseData.groupMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(CommerceGoodsSet);
