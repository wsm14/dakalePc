import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { Button } from 'antd';
import {
  GOODS_CLASS_TYPE,
  PEQUITY_GOODSBUY_TYPE,
  BUSINESS_TYPE,
  COMMISSION_TYPE,
} from '@/common/constant';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';
import GoodsGroupSet from './GoodsGroupSet';

const PlatformEquitySet = ({
  form,
  editActive,
  loading,
  selectList,
  dispatch,
  buyFlag,
  setBuyFlag,
  commissionShow,
  setCommissionShow,
  initialValues = {},
  skuMerchantList,
  setContent,
}) => {
  // 是否 editActive = 'againUp' || 'again' || 'edit'三种都隐藏的数据
  const commonDisabled = ['againUp', 'again', 'edit'].includes(editActive);
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive);

  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [radioData, setRadioData] = useState({ goodsType: 'single' }); // 商品类型 goodsType
  const [goodsTaglist, setGoodsTaglist] = useState([]); // 商家商品标签
  const [manualList, setManualList] = useState([]); // 分佣模版字段
  const [mreList, setMreList] = useState({
    groupId: null,
    type: 'merchant',
    keys: [],
    list: [],
  }); // 店铺备选参数，选择店铺后回显的数据

  //编辑的时候数据回显的标签
  const { goodsTagList = [] } = initialValues;

  const goodsTags = goodsTagList
    .filter((item) => item.tagType === 'merchant')
    .map((key) => key.configGoodsTagId);
  initialValues.goodsTags = goodsTags;

  const goodsTypeName = GOODS_CLASS_TYPE[radioData.goodsType];
  useEffect(() => {
    if (initialValues.relateName) {
      setMreList({
        type: initialValues.relateType,
        groupId: initialValues.relateId,
      });
      setBuyFlag(initialValues.buyFlag);
      setRadioData({ goodsType: initialValues.goodsType });
      // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/商家商品标签
      fetchGetMre(initialValues.relateName, initialValues.relateType, (list = []) => {
        const mreFindIndex = list.findIndex((item) => item.value === initialValues.relateId);
        const topCategoryId = list[mreFindIndex].topCategoryId[0];
        // 是否分佣
        getCommissionFlag(topCategoryId);
        // 商品标签
        getTagsPlat(topCategoryId);
      });
      if (initialValues.relateType === 'group') {
        getMerchantList();
      }
    }
  }, [initialValues.relateName]);

  //sku通用-sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: initialValues.specialGoodsId,
        ownerId: -1,
        relateId: initialValues.relateId,
        serviceType: 'rightGoods',
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

  //获取商家商品标签
  const getTagsPlat = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsTagListByCategoryId',
      payload: {
        categoryId: categoryId,
        tagType: 'merchant',
      },
      callback: (list) => setGoodsTaglist(list),
    });
  };

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
        serviceType: 'rightGoods',
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
      title: '设置参与活动的店铺',
      label: '选择店铺类型',
      type: 'radio',
      disabled: commonDisabled,
      name: 'relateType',
      select: BUSINESS_TYPE,
      onChange: (e) => {
        setCommissionShow(false);
        saveSelectData({ shopType: '0' });
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
      loading,
      select: selectList,
      disabled: commonDisabled,
      onSearch: fetchGetMre,
      onChange: (val, data) => {
        const { option } = data;
        setCommissionShow(false);
        getCommissionFlag(option.topCategoryId[0]);
        getTagsPlat(option.topCategoryId[0]);
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
        <Button type="primary" ghost onClick={() => setVisible(true)} disabled={commonDisabled}>
          选择店铺
        </Button>
      ),
    },
    {
      type: 'noForm',
      visible: mreList.type === 'group',
      formItem: (
        <MreSelectShow
          key="MreTable"
          form={form}
          disabled={commonDisabled}
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
      title: '设置商品信息',
      label: '商品类型',
      name: 'goodsType',
      disabled: commonDisabled,
      type: 'radio',
      select: GOODS_CLASS_TYPE,
      onChange: (e) => saveSelectData({ goodsType: e.target.value }),
    },
    {
      label: `${goodsTypeName}轮播图`,
      name: 'activityGoodsImg',
      type: 'upload',
      maxFile: 5,
      maxSize: 500,
    },
    {
      label: `${goodsTypeName}名称`,
      name: 'goodsName',
      maxLength: 80,
    },
    {
      type: 'noForm',
      visible: radioData.goodsType == 'package',
      formItem: <GoodsGroupSet key="packageGroupObjects" form={form}></GoodsGroupSet>,
    },
    {
      title: '设置商品价格',
      label: '原价',
      name: 'oriPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '售卖类型',
      name: 'buyFlag',
      type: 'radio',
      disabled: editDisabled,
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
      disabled: editDisabled,
    },
    {
      label: '现金（元）',
      name: ['paymentModeObject', 'cash'],
      type: 'number',
      precision: 2,
      min: 0.01,
      max: 999999.99,
      visible: buyFlag == '1',
      formatter: (value) => `￥ ${value}`,
      disabled: editDisabled,
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
      disabled: true,
      visible: commissionShow == '1' && buyFlag == '1',
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
      visible: buyFlag == '1' && commissionShow === '1',
      suffix: '卡豆',
      disabled: editDisabled,
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
      label: '店铺商品标签',
      name: 'goodsTags',
      type: 'select',
      mode: 'multiple',
      placeholder: '请选择店铺商品标签',
      select: goodsTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
      rules: [{ required: false }],
      addRules: [
        {
          validator: (rule, value) => {
            if (value.length > 3) {
              return Promise.reject('最多选择3个标签');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '介绍类型',
      name: 'goodsDescType',
      hidden: true,
    },
    {
      title: '设置单品介绍',
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

export default connect(({ baseData, loading, specialGoods }) => ({
  specialGoods,
  skuMerchantList: baseData.skuMerchantList,
  selectList: baseData.groupMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(PlatformEquitySet);
