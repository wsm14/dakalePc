import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { Button } from 'antd';
import { GOODS_CLASS_TYPE, SPECIAL_DESC_TYPE, BUSINESS_TYPE } from '@/common/constant';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';
import GoodsGroupSet from './GoodsGroupSet';

const PreferentialSet = ({
  form,
  editActive,
  loading,
  selectList,
  dispatch,
  commissionShow,
  setCommissionShow,
  initialValues = {},
  onValuesChange,
  skuMerchantList,
  setContent,
}) => {
  // 是否 editActive = 'againUp' || 'again' || 'edit'三种都隐藏的数据
  const commonDisabled = ['againUp', 'again', 'edit'].includes(editActive);
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive);

  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [goodsDescType, setGoodsDescType] = useState('0'); // 商品介绍类型
  const [radioData, setRadioData] = useState({ goodsType: 'single' }); // 商品类型 goodsType
  const [goodsTaglist, setGoodsTaglist] = useState([]); // 商家商品标签
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
    if (initialValues.ownerName) {
      // 图文介绍类型
      setGoodsDescType(initialValues.goodsDescType);
      setMreList({
        type: initialValues.ownerType,
        groupId: initialValues.ownerId,
      });
      setRadioData({ goodsType: initialValues.goodsType });
      // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/商家商品标签
      fetchGetMre(initialValues.ownerName, initialValues.ownerType, (list = []) => {
        const mreFindIndex = list.findIndex((item) => item.value === initialValues.ownerId);
        const topCategoryId = list[mreFindIndex].topCategoryId[0];
        // 是否分佣
        getCommissionFlag(topCategoryId);
        // 商品标签
        getTagsPlat(topCategoryId);
      });
      if (initialValues.ownerType === 'group') {
        getMerchantList();
      }
    }
  }, [initialValues.ownerName]);

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
      title: '设置参与活动的店铺',
      label: '选择店铺类型',
      type: 'radio',
      disabled: commonDisabled,
      name: 'ownerType',
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
        form.setFieldsValue({ ownerId: undefined }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.type]}`,
      type: 'select',
      name: 'ownerId',
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
    // {
    //   label: '店铺范围',
    //   type: 'radio',
    //   name: 'shopType',
    //   disabled: editActive,
    //   visible: mreList.name && mreList.type === 'group',
    //   select: ['全部', '部分'],
    //   onChange: (e) => saveSelectData({ shopType: e.target.value }),
    // },
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
      label: `${goodsTypeName}原价`,
      name: 'oriPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '特惠价格',
      name: 'realPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
      addRules: [
        {
          validator: (rule, value) => {
            const realPrice = Number(value);
            const buyPrice = Number(form.getFieldValue('oriPrice'));
            if (realPrice > buyPrice) {
              return Promise.reject('特惠价格需小于套餐价格');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '商家结算价',
      name: 'merchantPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
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
      disabled: commonDisabled,
      visible: commissionShow == '1',
      formatter: (value) => `￥ ${value}`,
      // rules: [{ required: false }],
    },
    {
      label: '商家商品标签',
      name: 'goodsTags',
      type: 'select',
      mode: 'multiple',
      placeholder: '请选择商家商品标签',
      select: goodsTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
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
      title: `设置${goodsTypeName}介绍`,
      label: '选择介绍类型',
      type: 'radio',
      name: 'goodsDescType',
      select: SPECIAL_DESC_TYPE,
      onChange: (e) => setGoodsDescType(e.target.value),
    },
    {
      label: `${goodsTypeName}介绍`,
      type: 'textArea',
      name: 'goodsDesc',
      hidden: goodsDescType !== '0',
      rules: [{ required: false }],
      maxLength: 200,
    },
    {
      label: `${goodsTypeName}图片`,
      name: 'goodsDescImg',
      type: 'upload',
      maxFile: 20,
      hidden: goodsDescType !== '0',
      rules: [{ required: false }],
    },
    {
      type: 'noForm',
      visible: goodsDescType === '1',
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
        onValuesChange={(changedValues, allValues) => onValuesChange && onValuesChange(allValues)}
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

export default connect(({ baseData, loading, specialGoods }) => ({
  specialGoods,
  skuMerchantList: baseData.skuMerchantList,
  selectList: baseData.groupMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(PreferentialSet);
