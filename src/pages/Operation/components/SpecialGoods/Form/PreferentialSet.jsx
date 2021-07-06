import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { Button } from 'antd';
import { GOODS_CLASS_TYPE, BUSINESS_TYPE } from '@/common/constant';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import FormCondition from '@/components/FormCondition';
import GoodsGroupSet from '../GoodsGroupSet';
import PlatformProductTag from '../PlatformProductTag';

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
}) => {
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  // 店铺备选参数，选择店铺后回显的数据
  const [mreList, setMreList] = useState({
    name: '',
    groupId: null,
    type: 'merchant',
    keys: [],
    list: [],
  });
  // 商品类型 goodsType
  const [radioData, setRadioData] = useState({ goodsType: 'single' });
  const [platTaglist, setPlatTaglist] = useState([]);

  const goodsTypeName = GOODS_CLASS_TYPE[radioData.goodsType];
  useEffect(() => {
    if (initialValues.ownerName) {
      fetchGetMre(initialValues.ownerName, initialValues.ownerType);
    }
  }, [initialValues.ownerName]);

  // 搜索店铺
  const fetchGetMre = debounce((name, type) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        name,
        type: type || mreList.type,
      },
    });
  }, 500);

  const saveMreData = (data) => setMreList({ ...mreList, ...data });

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  //获取平台商品标签
  const getTagsPlat = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsTagListByCategoryId',
      payload: {
        categoryId: categoryId,
        tagType: 'platform',
      },
      callback: (list) => setPlatTaglist(list),
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
      disabled: editActive,
      name: 'ownerType',
      select: BUSINESS_TYPE,
      onChange: (e) => {
        setCommissionShow(false);
        saveSelectData({ shopType: '0' });
        saveMreData({
          type: e.target.value,
          groupId: null,
          ratio: 0,
          name: '',
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
      disabled: editActive,
      onSearch: fetchGetMre,
      onChange: (val, data) => {
        const { option } = data;
        console.log(option, 'oooo');
        setCommissionShow(false);
        getCommissionFlag(option.topCategoryId[0]);
        getTagsPlat(option.topCategoryId[0]);
        saveMreData({
          name: option.name,
          groupId: val,
          ratio: option.commissionRatio,
          keys: [],
          list: [],
        });
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
      visible: mreList.name && mreList.type == 'group',
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)} disabled={editActive}>
          选择店铺
        </Button>
      ),
    },
    {
      type: 'noForm',
      visible: mreList.name && mreList.type === 'group',
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
      title: '设置商品信息',
      label: '商品类型',
      name: 'goodsType',
      type: 'radio',
      select: GOODS_CLASS_TYPE,
      onChange: (e) => saveSelectData({ goodsType: e.target.value }),
    },
    {
      label: `${goodsTypeName}轮播图`,
      name: 'activityGoodsImg',
      type: 'upload',
      maxFile: 5,
    },
    {
      label: `${goodsTypeName}名称`,
      name: 'goodsName',
      maxLength: 30,
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
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '特惠价格',
      name: 'realPrice',
      type: 'number',
      precision: 2,
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
      visible: commissionShow == '1',
      formatter: (value) => `￥ ${value}`,
      rules: [{ required: false }],
    },
    {
      label: '平台商品标签',
      name: 'goodsTags',
      type: 'tags',
      select: platTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
    },

    {
      title: `设置${goodsTypeName}介绍`,
      label: `${goodsTypeName}介绍`,
      type: 'textArea',
      name: 'goodsDesc',
      rules: [{ required: false }],
      maxLength: 200,
    },
    {
      label: `${goodsTypeName}图片`,
      name: 'goodsDescImg',
      type: 'upload',
      maxFile: 5,
      rules: [{ required: false }],
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
