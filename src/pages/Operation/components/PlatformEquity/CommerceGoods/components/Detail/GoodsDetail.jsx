import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import {
  BUSINESS_TYPE,
  GOODS_CLASS_TYPE,
  SPECIAL_DESC_TYPE,
  COMMISSION_TYPE,
  COMMERCE_GOODSBUY_TYPE,
  COUPON_BUY_RULE,
} from '@/common/constant';

const GoodsDetail = (props) => {
  const { detail } = props;
  const { goodsType, relateType, goodsDescType, buyFlag, serviceDivisionDTO = {} } = detail;
  const { divisionTemplateType, ...other } = serviceDivisionDTO; // 分佣

  const ActiveformItems = [
    {
      name: 'relateType',
      label: '店铺类型',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      name: 'relateName',
      label: `${BUSINESS_TYPE[relateType]}名称`,
    },
  ];

  const GoodFormItem = [
    {
      name: 'activityGoodsImg',
      label: `${GOODS_CLASS_TYPE[goodsType]}轮播图`,
      type: 'upload',
    },
    {
      name: 'goodsName',
      label: `${GOODS_CLASS_TYPE[goodsType]}名称`,
    },
  ];

  const GoodPriceItem = [
    {
      name: 'buyFlag',
      label: '售卖类型',
      render: (val) => COMMERCE_GOODSBUY_TYPE[val],
    },
    {
      name: 'oriPrice',
      label: `原价`,
    },
    {
      label: '卡豆+现金',
      show: buyFlag === '1',
      name: 'paymentModeObject',
      render: (val) => `${val.bean || 0} 卡豆 + ${val.cash} 元`,
    },
    {
      label: '现金',
      show: buyFlag === '2',
      name: 'paymentModeObject',
      render: (val) => `${val.cash} 元`,
    },
  ];

  const GoodDecItem = [
    {
      label: '介绍类型',
      name: 'goodsDescType',
      render: (val) => SPECIAL_DESC_TYPE[val],
    },
    {
      label: `${GOODS_CLASS_TYPE[goodsType]}介绍`,
      name: 'richText',
      show: goodsDescType === '1',
      render: (val) => <div dangerouslySetInnerHTML={{ __html: val }}></div>,
    },
  ];

  const BuyRegularItem = [
    {
      name: 'buyRule',
      label: '购买上限',
      render: (val) => COUPON_BUY_RULE[val],
    },
    {
      label: `单人${
        { personLimit: '每人', dayLimit: '每天', unlimited: '不限' }[detail.buyRule]
      }购买份数`,
      name: { personLimit: 'maxBuyAmount', dayLimit: 'dayMaxBuyAmount' }[detail.buyRule],
      render: (val) => (val ? `${val}份` : '--'),
    },
    // {
    //   name: 'needOrder',
    //   label: '是否需要预约购买',
    //   render: (val) => (val == 1 ? '是' : '否'),
    // },
    // {
    //   name: 'buyDesc',
    //   label: '购买须知',
    //   render: (val) => val.map((items, ins) => <div key={ins}>{items}</div>),
    // },
    // {
    //   name: 'allowRefund',
    //   label: '退款规则',
    //   render: (val, row) => (
    //     <>
    //       <div>
    //         <span style={{ marginRight: '8px' }}>是否允许随时退款:</span>
    //         <span>{val == 1 ? '是' : '否'}</span>
    //       </div>
    //       <div>
    //         <span style={{ marginRight: '8px' }}>是否允许过期退款: </span>
    //         <span>{row.allowExpireRefund == 1 ? '是' : '否'}</span>
    //       </div>
    //     </>
    //   ),
    // },
  ];

  const formItemComiss = Object.keys(other).map((i) => ({
    label: `${COMMISSION_TYPE[i.replace('Bean', '')]}卡豆`,
    name: ['serviceDivisionDTO', i],
  }));

  return (
    <>
      <DescriptionsCondition
        title="参与活动的店铺"
        formItems={ActiveformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="商品信息"
        formItems={GoodFormItem}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="商品价格"
        formItems={GoodPriceItem}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="商品介绍"
        formItems={GoodDecItem}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="购买规则"
        formItems={BuyRegularItem}
        initialValues={detail}
      ></DescriptionsCondition>
      {/* 当分佣方式为自定义佣金和手动分佣时才显示 */}
      {detail.divisionFlag === '1' && buyFlag == '1' && (
        <DescriptionsCondition
          title="分佣配置（卡豆）"
          formItems={formItemComiss}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
    </>
  );
};
export default GoodsDetail;
