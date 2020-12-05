import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import GoodsSetTable from '../Form/components/GoodsSetTable';

const GoodsDetail = (props) => {
  const { detail = {} } = props;

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
      label: '单品名称',
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
      render: (val, record) => `￥${val}`,
    },
    {
      label: detail.goodsType == 'single' ? '单品介绍' : '套餐介绍',
      name: 'goodsDesc',
      render: (val, record) => (
        <div>
          {val}
          <div>
            {record.goodsDescImg &&
              record.goodsDescImg
                .split(',')
                .map((item) => (
                  <img key={item} src={item} style={{ width: '100%', marginTop: 10 }}></img>
                ))}
          </div>
        </div>
      ),
    },
    {
      label: '套餐内单品',
      show: detail.goodsType == 'package',
      name: 'packageGoods',
      render: (val) => <GoodsSetTable detail={JSON.parse(val)}></GoodsSetTable>,
    },
  ];

  return (
    <>
      <DescriptionsCondition
        column={2}
        formItems={formItems}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};

export default GoodsDetail;
