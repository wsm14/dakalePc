import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import SetMealTable from './SetMealTable';
import MerchantListTable from './MerchantListTable';
import {
  BUSINESS_TYPE,
  GOODS_CLASS_TYPE,
  SPECIAL_DESC_TYPE,
  BUSINESS_SALE_TYPE,
  SPECIAL_GOODS_TYPE,
} from '@/common/constant';

const GoodsDetail = (props) => {
  const { detail, merchantList } = props;
  const { relateType, thirdInfoResp = {}, productType, paymentModeType } = detail;
  const { thirdType } = thirdInfoResp;

  const ActiveformItems = [
    {
      title: '参与活动的店铺',
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
      name: ['thirdInfoReq', 'thirdType'],
      label: `商品类别`,
      render: (val) => SPECIAL_GOODS_TYPE[val],
    },
    {
      name: ['thirdInfoReq', 'thirdId'],
      label: `自我游编码`,
      show: thirdType == '2',
    },
    {
      name: 'productType',
      label: '商品类型',
      render: (val) => GOODS_CLASS_TYPE[val],
    },
    {
      name: 'goodsImg',
      label: `${GOODS_CLASS_TYPE[productType]}轮播图`,
      type: 'upload',
    },
    {
      name: 'goodsName',
      label: `${GOODS_CLASS_TYPE[productType]}名称`,
    },
    {
      name: 'productType',
      label: '套餐单品',
      show: productType == 'package',
      render: (val, row) => (
        <SetMealTable packageGroupObjects={row.packageGroupObjects || []}></SetMealTable>
      ),
    },
  ];

  const GoodPriceItem = [
    {
      name: ['skuInfoReq', 'oriPrice'],
      label: `${GOODS_CLASS_TYPE[productType]}原价`,
    },
    {
      name: ['skuInfoReq', 'costPrice'],
      label: '成本价',
    },
    {
      name: ['skuInfoReq', 'sellPrice'],
      label: '零售价',
    },
    {
      name: ['skuInfoReq', 'sellBean'],
      label: '卡豆',
      show: paymentModeType === 'self',
    },
    {
      name: ['skuInfoReq', 'settlePrice'],
      label: '商家结算价',
    },
    {
      name: 'otherPlatformPrice',
      label: '其他平台价格',
    },
    {
      name: 'paymentModeType',
      label: '售卖价格类型',
      render: (val) => BUSINESS_SALE_TYPE[val],
    },
  ];

  const formItemComiss = [
    {
      label: '省代分佣金额（卡豆）',
      name: ['serviceDivisionDTO', 'provinceBean'],
    },
    {
      label: '地级市分佣金额（卡豆）',
      name: ['serviceDivisionDTO', 'cityBean'],
    },
    {
      label: '区县分佣金额（卡豆）',
      name: ['serviceDivisionDTO', 'districtBean'],
    },

    {
      label: '哒人分佣金额（卡豆）',
      name: ['serviceDivisionDTO', 'darenBean'],
    },
  ];

  const formItemTag = [
    {
      label: '商家商品标签',
      name: 'goodsTagList',
      // show: detail.goodsTagList,
      render: (val, row) => {
        const { goodsTagList = [] } = row;
        const tags = goodsTagList.filter((items) => items.tagType === 'merchant');
        return (
          <>
            {tags &&
              tags.map((tag) => (
                <span
                  style={{
                    display: 'inline-block',
                    padding: 8,
                    margin: '5px',
                    border: '1px solid #ddd',
                  }}
                  key={tag.configGoodsTagId}
                >
                  {tag.tagName}
                </span>
              ))}
          </>
        );
      },
    },
    {
      label: '平台商品标签',
      name: 'platformGoodsTagList',
      // show: detail.goodsTagList,
      render: (val, row) => {
        const { platformGoodsTagList = [] } = row;
        const tags = platformGoodsTagList.filter((items) => items.tagType === 'platform');
        return (
          <>
            {tags &&
              tags.map((tag) => (
                <span
                  style={{
                    display: 'inline-block',
                    padding: 8,
                    margin: '5px',
                    border: '1px solid #ddd',
                  }}
                  key={tag.configGoodsTagId}
                >
                  {tag.tagName}
                </span>
              ))}
          </>
        );
      },
    },
  ];

  return (
    <>
      <DescriptionsCondition
        title="参与活动的店铺"
        formItems={ActiveformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      {relateType === 'group' && (
        <div style={{ margin: '10px' }}>
          <MerchantListTable merchantList={merchantList || []}></MerchantListTable>
        </div>
      )}
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

      {/* 当分佣方式为自定义佣金和手动分佣时才显示 */}
      {/* {detail.divisionFlag === '1' && (
        <DescriptionsCondition
          title="分佣配置"
          formItems={formItemComiss}
          initialValues={detail}
        ></DescriptionsCondition>
      )} */}
      {/* <DescriptionsCondition
        title="商品标签"
        formItems={formItemTag}
        initialValues={detail}
      ></DescriptionsCondition> */}
    </>
  );
};
export default GoodsDetail;
