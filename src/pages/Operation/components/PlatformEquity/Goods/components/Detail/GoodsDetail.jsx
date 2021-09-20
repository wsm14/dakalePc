import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import SetMealTable from './SetMealTable';
import MerchantListTable from './MerchantListTable';
import {
  BUSINESS_TYPE,
  GOODS_CLASS_TYPE,
  SPECIAL_DESC_TYPE,
  PEQUITY_GOODSBUY_TYPE,
} from '@/common/constant';

const GoodsDetail = (props) => {
  const { detail, merchantList } = props;
  const { goodsType, relateType, goodsDescType, buyFlag } = detail;

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
      name: 'goodsType',
      label: '商品类型',
      render: (val) => GOODS_CLASS_TYPE[val],
    },
    {
      name: 'activityGoodsImg',
      label: `${GOODS_CLASS_TYPE[goodsType]}轮播图`,
      type: 'upload',
    },
    {
      name: 'goodsName',
      label: `${GOODS_CLASS_TYPE[goodsType]}名称`,
    },
    {
      name: 'goodsType',
      label: '套餐单品',
      show: goodsType == 'package',
      render: (val, row) => (
        <SetMealTable packageGroupObjects={row.packageGroupObjects || []}></SetMealTable>
      ),
    },
  ];

  const GoodPriceItem = [
    {
      name: 'oriPrice',
      label: `原价`,
    },
    {
      name: 'realPrice',
      label: '成本价',
    },
    {
      name: 'buyFlag',
      label: '售卖类型',
      render: (val) => PEQUITY_GOODSBUY_TYPE[val],
    },
    {
      name: 'paymentModeObject',
      shwo: buyFlag === '1',
      label: '卡豆+现金',
      render: (val) => `${val.bean || 0} 卡豆 + ${val.cash} 元`,
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
    {
      label: `${GOODS_CLASS_TYPE[goodsType]}介绍`,
      name: 'goodsDesc',
      show: goodsDescType === '0',
      type: 'textArea',
    },
    {
      label: `${GOODS_CLASS_TYPE[goodsType]}介绍图片`,
      name: 'goodsDescImg',
      show: goodsDescType === '0',
      type: 'upload',
    },
  ];

  const formItemComiss = [
    {
      label: '省代分佣金额（元）',
      name: ['serviceDivisionDTO', 'provinceBean'],
    },
    {
      label: '区县分佣金额（元）',
      name: ['serviceDivisionDTO', 'districtBean'],
    },
    {
      label: '哒人分佣金额（元）',
      name: ['serviceDivisionDTO', 'darenBean'],
    },
  ];

  const TagCell = ({ children }) => (
    <span
      style={{
        display: 'inline-block',
        padding: 8,
        margin: '5px',
        border: '1px solid #ddd',
      }}
    >
      {children}
    </span>
  );

  const formItemTag = [
    {
      label: '商家商品标签',
      name: 'goodsTagList',
      render: (val, row) => {
        const { goodsTagList = [] } = row;
        const tags = goodsTagList.filter((items) => items.tagType === 'merchant');
        return tags.map((tag) => <TagCell key={tag.configGoodsTagId}>{tag.tagName}</TagCell>);
      },
    },
    {
      label: '平台商品标签',
      name: 'platformGoodsTagList',
      render: (val, row) => {
        const { platformGoodsTagList = [] } = row;
        const tags = platformGoodsTagList.filter((items) => items.tagType === 'platform');
        return tags.map((tag) => <TagCell key={tag.configGoodsTagId}>{tag.tagName}</TagCell>);
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
      <DescriptionsCondition
        title="商品介绍"
        formItems={GoodDecItem}
        initialValues={detail}
      ></DescriptionsCondition>
      {/* 当分佣方式为自定义佣金和手动分佣时才显示 */}
      {detail.divisionFlag === '1' && buyFlag == '1' && (
        <DescriptionsCondition
          title="分佣配置"
          formItems={formItemComiss}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
      <DescriptionsCondition
        title="商品标签"
        formItems={formItemTag}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};
export default GoodsDetail;
