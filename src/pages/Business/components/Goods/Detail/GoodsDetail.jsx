import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { detail = {} } = props;

  // 信息
  const formItems = [
    {
      label: '商品图片',
      type: 'upload',
      name: 'goodsImg',
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
      label: '单品介绍',
      name: 'goodsDesc',
      render: (val, record) => (
        <div>
          {val}
          <div>
            {record.goodsDescImg &&
              record.goodsDescImg
                .split(',')
                .map((item) => <img src={item} style={{ width: '100%', marginTop: 10 }}></img>)}
          </div>
        </div>
      ),
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
