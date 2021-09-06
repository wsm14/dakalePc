import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import SetMealTable from './SetMealTable';
import MerchantListTable from '../../SpecialGoods/Detail/MerchantListTable';
import { BUSINESS_TYPE, GOODS_CLASS_TYPE } from '@/common/constant';

const GoodsDetail = (props) => {
  const { detail, merchantList = [], tabkey } = props;
  const { goodsType, ownerType } = detail;

  const ActiveformItems = [
    {
      title: '参与活动的店铺',
      name: 'ownerType',
      label: '店铺类型',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      name: 'ownerName',
      label: '店铺名称',
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
      label: `${GOODS_CLASS_TYPE[goodsType]}原价`,
    },
    {
      name: 'realPrice',
      label: '特惠价格',
    },
    {
      name: 'merchantPrice',
      label: '商家结算价',
    },
    {
      name: 'otherPlatformPrice',
      label: '其他平台价格',
    },
  ];

  const GoodDecItem = [
    {
      name: 'goodsDesc',
      label: `${GOODS_CLASS_TYPE[goodsType]}介绍`,
      type: 'textArea',
    },
    {
      name: 'goodsDescImg',
      label: `${GOODS_CLASS_TYPE[goodsType]}介绍图片`,
      type: 'upload',
    },
  ];

  const commissionItem = [
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

  const formItemTag = [
    {
      label: '商家商品标签',
      name: 'goodsTagList',
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
      // show: detail.auditStatus !== '0',
    },
    {
      label: '平台商品标签',
      name: 'goodsTagList',
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
      {ownerType === 'group' && (
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
      {detail.divisionFlag === '1' && !['adminAudit'].includes(tabkey) && (
        <DescriptionsCondition
          title="分佣配置"
          formItems={commissionItem}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
      {!['adminAudit'].includes(tabkey) && (
        <DescriptionsCondition
          title="商品标签"
          formItems={formItemTag}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
    </>
  );
};
export default GoodsDetail;
