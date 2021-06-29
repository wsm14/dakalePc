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
  initialValues = {},
  onValuesChange,
}) => {
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  // 店铺备选参数，选择店铺后回显的数据
  const [mreList, setMreList] = useState({ name: '', type: 'merchant', keys: [], list: [] });
  // 商品类型 goodsType 店铺范围 shopType
  const [radioData, setRadioData] = useState({ goodsType: 'single', shopType: '0' });
  const [platTaglist, setPlatTaglist] = useState([]);

  const goodsTypeName = GOODS_CLASS_TYPE[radioData.goodsType];

  // 搜索店铺
  const fetchGetMre = debounce((merchantName) => {
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
      payload: {
        limit: 999,
        page: 1,
        bankStatus: 3,
        businessStatus: 1,
        merchantName,
        groupFlag: mreList.type === 'merchant' ? 0 : 1,
      },
    });
  }, 500);

  useEffect(() => {
    getTagsPlat();
  }, []);

  const saveMreData = (data) => setMreList({ ...mreList, ...data });

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });
  //获取平台商品标签
  const getTagsPlat = () => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagList',
      payload: {
        tagType: 'platform',
      },
      callback: (list) => setPlatTaglist(list),
    });
  };

  // 信息
  const formItems = [
    {
      title: '设置参与活动的店铺',
      label: '选择店铺类型',
      type: 'radio',
      disabled: editActive,
      name: 'ownerType',
      select: { merchant: '单店', group: '集团' },
      onChange: (e) => {
        saveSelectData({ shopType: '0' });
        saveMreData({ type: e.target.value, ratio: 0, name: '', keys: [], list: [] }); // 重置已选店铺数据
        form.setFieldsValue({ merchantId: undefined, shopType: '0' }); // 重置数据
        dispatch({ type: 'businessList/close' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.type]}`,
      type: 'select',
      name: 'merchantId',
      placeholder: '请输入搜索',
      loading,
      select: selectList,
      disabled: editActive,
      onSearch: fetchGetMre,
      onChange: (val, data) => {
        const { option } = data;
        saveMreData({ name: option.name, ratio: option.commissionRatio, keys: [], list: [] });
      },
    },
    {
      label: '店铺范围',
      type: 'radio',
      name: 'shopType',
      disabled: editActive,
      visible: mreList.name && mreList.type === 'group',
      select: ['全部', '部分'],
      onChange: (e) => saveSelectData({ shopType: e.target.value }),
    },
    {
      label: '适用店铺',
      name: 'merchantIdList',
      type: 'formItem',
      visible: mreList.name && radioData.shopType === '1',
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)} disabled={editActive}>
          选择店铺
        </Button>
      ),
    },
    {
      type: 'noForm',
      visible: mreList.name && radioData.shopType === '1',
      formItem: (
        <MreSelectShow
          key="MreTable"
          form={form}
          {...mreList}
          setMreList={(val) => {
            saveMreData(val);
            form.setFieldsValue({ merchantIdList: val.keys });
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
      label: '佣金金额', // 手动分佣需要展示
      name: 'provincialCommission',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
      visible:false,
      show:false
    },
    {
      label: '省代佣金',
      name: 'provincialCommission',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '区县佣金',
      name: 'districtCommission',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '平台商品标签',
      name: 'platformProduct',
      type: 'tags',
      select: platTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
    },
    // {
    //   title: `商品标签`,
    //   // label: `平台商品标签`,
    //   type: 'noForm',
    //   // name: 'platformProduct',
    //   // rules: [{ required: true }],
    //   formItem: <PlatformProductTag key="platformProduct" form={form}></PlatformProductTag>,
    //   maxLength: 200,
    // },
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
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        params={{ groupFlag: 1, groupName: mreList.name }}
        onOk={saveMreData}
        onCancel={() => setVisible(false)}
      ></MreSelect>
    </>
  );
};

export default connect(({ businessList, loading }) => ({
  selectList: businessList.selectList,
  loading: loading.models.businessList,
}))(PreferentialSet);
