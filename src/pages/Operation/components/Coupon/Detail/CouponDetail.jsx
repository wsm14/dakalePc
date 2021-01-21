import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { detail = {} } = props;

  // 参与活动的店铺
  const mreFormItems = [
    {
      label: '店铺类型',
      name: 'allImgs',
    },
    {
      label: '集团名称',
      name: 'merchantName',
    },
    {
      label: '店铺范围',
      name: 'goodsType',
      children: '111',
    },
  ];

  // 券信息
  const couponFormItems = [
    {
      label: '券名称',
      name: 'allImgs',
    },
    {
      label: '券价值',
      name: 'merchantName',
    },
    {
      label: '售卖价格',
      name: 'goodsType',
      children: '111',
    },
  ];

  // 使用规则
  const useFormItems = [
    {
      label: '使用门槛',
      name: 'allImgs',
    },
    {
      label: '使用有效期',
      name: 'merchantName',
    },
    {
      label: '投放总量',
      name: 'goodsType',
    },
    {
      label: '购买上限',
      name: 'goodsType',
      render: () => '111',
      children: <div>单人最高购买份数: 3</div>,
    },
    {
      label: '购买须知',
      name: 'goodsType',
    },
    {
      label: '退款规则',
      name: 'goodsType',
      render: () => `是否允许随时退款 \n 是否允许过期退款`,
    },
  ];

  return (
    <>
      <DescriptionsCondition
        title="参与活动的店铺"
        formItems={mreFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="券信息"
        formItems={couponFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="使用规则"
        formItems={useFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};

export default GoodsDetail;
