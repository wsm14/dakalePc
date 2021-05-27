import React from 'react';
import { Alert } from 'antd';
import { GOODS_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import GoodsSetTable from '../Form/components/GoodsSetTable';

const GoodsDetail = (props) => {
  const { detail = {} } = props;

  const { status } = detail;

  // 信息
  const formItems = [
    {
      label: '商品图片',
      type: 'upload',
      name: 'allImgs',
    },
    {
      label: '所属店铺',
      name: 'merchantName',
    },
    {
      label: '商品类型',
      name: 'goodsType',
      render: (val) => (val == 'package' ? '套餐' : '单品'),
    },
    {
      label: `${detail.goodsType == 'package' ? '套餐' : '单品'}名称`,
      name: 'goodsName',
    },
    {
      label: '单位',
      show: detail.goodsType == 'single',
      name: 'goodsUnit',
    },
    {
      label: '所属分类',
      name: 'customCategoryName',
    },
    {
      label: '售价',
      name: 'price',
      render: (val, record) => `￥${Number(val).toFixed(2)}`,
    },
    {
      label: '套餐内单品',
      show: detail.goodsType == 'package',
      name: 'packageGoods',
      render: (val) => <GoodsSetTable detail={val !== '--' ? JSON.parse(val) : []}></GoodsSetTable>,
    },
    {
      label: detail.goodsType == 'single' ? '单品介绍' : '套餐介绍',
      name: 'goodsDesc',
    },
    {
      label: '介绍图片',
      type: 'upload',
      name: 'goodsDescImg',
    },
  ];

  return (
    <>
      <Alert
        message={GOODS_TYPE[status]}
        type={status == 1 ? 'success' : 'warning'}
        style={{ textAlign: 'center', marginBottom: 5 }}
      />
      <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
    </>
  );
};

export default GoodsDetail;
