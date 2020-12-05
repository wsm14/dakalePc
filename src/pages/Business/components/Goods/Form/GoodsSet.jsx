import React, { useState } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';
import GoodsSetTable from './components/GoodsSetTable';

const GoodsSet = ({ form, loading, goodsManage, dispatch }) => {
  const { mreSelect, classifySelect } = goodsManage;

  const [goodsType, setGoodsType] = useState('single');

  // 搜索商家
  const fetchClassifyGetMre = debounce((keyword) => {
    if (!keyword) return;
    dispatch({
      type: 'goodsManage/fetchClassifyGetMre',
      payload: {
        limit: 999,
        page: 1,
        keyword,
      },
    });
  }, 500);

  // 搜索商家 后搜索类别
  const fetchGetClassify = (merchantId) => {
    form.setFieldsValue({ customCategoryId: undefined });
    if (!merchantId) return;
    dispatch({
      type: 'goodsManage/fetchGoodsGetClassify',
      payload: {
        limit: 999,
        page: 1,
        merchantId,
      },
    });
  };

  // 信息
  const formItems = [
    {
      label: '商品图片',
      type: 'upload',
      name: 'allImgs',
      multiple: true,
      maxFile: 5,
    },
    {
      label: '所属店铺',
      name: 'merchantId',
      type: 'select',
      loading: loading.effects['goodsManage/fetchClassifyGetMre'],
      onSearch: (val) => fetchClassifyGetMre(val),
      onChange: (val) => fetchGetClassify(val),
      select: mreSelect,
      placeholder: '请输入店铺名称搜索',
    },
    {
      label: '商品类型',
      name: 'goodsType',
      type: 'radio',
      select: [
        { value: 'single', name: '单品' },
        { value: 'package', name: '套餐' },
      ],
      onChange: (e) => setGoodsType(e.target.value),
    },
    {
      label: '单品名称',
      name: 'goodsName',
      maxLength: 30,
    },
    {
      label: '单位',
      name: 'goodsUnit',
      maxLength: 4,
      visible: goodsType == 'single',
      rules: [{ required: false }],
    },
    {
      label: '所属分类',
      name: 'customCategoryId',
      type: 'select',
      loading: loading.effects['goodsManage/fetchGoodsGetClassify'],
      select: classifySelect,
      placeholder: '请先选择店铺',
      onChange: (val, item) => form.setFieldsValue({ customCategoryName: item.children[0] }),
    },
    {
      label: '自定义类目名',
      name: 'customCategoryName',
      rules: [{ required: false }],
      hidden: true,
    },
    {
      type: 'noForm',
      visible: goodsType == 'package',
      childrenOwn: <GoodsSetTable key="groups" form={form}></GoodsSetTable>,
    },
    {
      label: '套餐内单品：',
      name: 'packageGoodsObjects',
      rules: [{ required: false }],
      hidden: true,
    },
    {
      label: '售价',
      name: 'price',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: goodsType == 'single' ? '单品介绍' : '套餐介绍',
      name: 'goodsDesc',
      type: 'textArea',
      rules: [{ required: false }],
    },
    {
      label: '上架状态',
      name: 'onSellFlag',
      type: 'radio',
      select: ['暂不上架', '立即上架'],
    },
  ];

  return <FormCondition form={form} formItems={formItems}></FormCondition>;
};

export default connect(({ goodsManage, loading }) => ({
  loading,
  goodsManage,
}))(GoodsSet);
