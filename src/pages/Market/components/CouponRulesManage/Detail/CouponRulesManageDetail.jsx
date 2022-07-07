import React from 'react';
import { connect } from 'umi';
import {
  TAG_COLOR_TYPE,
  GOODS_CLASS_TYPE,
  CONPON_RULES_TYPE,
  ELECTRICGOODS_SELL_PRICE_TYPE,
} from '@/common/constant';
import { Tag } from 'antd';
import { getCityName, checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { ruleId, detail = {}, ruleDetailListObj = {} } = props;
  const { subRuleType, ruleType } = detail;

  const formItems = [
    {
      label: '规则类型',
      name: 'ruleType',
      render: (val) => CONPON_RULES_TYPE[val],
    },
    {
      label: '规则名称',
      name: 'ruleName',
    },
  ];

  const itemsProps = {
    categoryRule: [
      {
        label: '指定行业',
        name: 'ruleConditionsList',
        render: (val) =>
          val
            ?.map((item) =>
              item.categoryIdString
                ? `${item.topCategoryName}/${item?.categoryName}`
                : `${item.topCategoryName}`,
            )
            .join(';'),
      },
    ],
    merchantRule: [
      {
        label: '指定店铺',
        name: 'remark',
        render: (val) => {
          const str = val.slice(2);
          return str && `${str}可用`;
        },
      },
    ],
    goodsRule: [
      {
        label: '指定商品',
        name: 'remark',
        render: (val) => {
          const str = val.slice(2);
          return str && `${str}可用`;
        },
      },
    ],
    tagRule: [
      {
        label: '标签类型',
        name: 'subRuleType',
        render: (val) =>
          ({
            platformGoodsTags: '平台商品标签',
            merchantGoodsTags: '商家商品标签',
          }[val]),
      },
      {
        label: '指定商品标签',
        name: 'ruleConditionsList',
        render: (val) => val?.map((item) => item.tagName).join(';'),
      },
    ],
    availableAreaRule: [
      {
        label: '可用区域',
        name: 'ruleConditions',
        render: (val) => val?.map((item) => getCityName(item.condition)).join(';'),
      },
    ],
    unavailableAreaRule: [
      {
        label: '不可用区域',
        name: 'ruleConditions',
        render: (val) => val?.map((item) => getCityName(item.condition)).join(';'),
      },
    ],
    userRule: [
      {
        label: '适用人群',
        name: 'remark',
        render: () => '仅限哒人', // 暂时只有一种
      },
    ],
    userOsRule: [
      {
        label: '使用端口',
        name: 'ruleConditions',
        render: (val) => val?.map((item) => PLATFORM_APPLY_PORT_TYPE[item.condition]).join(';'),
      },
    ],
  }[ruleType];

  // 店铺/集团 表头
  const merchantGetColumns = (id) => [
    {
      title: '店铺类型',
      dataIndex: 'mobile',
      render: (val, row) =>
        subRuleType === 'group' ? '集团' : row.groupIdString ? '子门店' : '单店',
    },
    {
      title: '店铺名称',
      dataIndex: subRuleType === 'group' ? 'groupName' : 'merchantName',
    },
    {
      title: '店铺ID',
      dataIndex: id,
    },
    {
      title: '经营类目',
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      title: '地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
  ];

  // 特惠商品/电商品 表头
  const specialGoodsColumns = [
    {
      title: '类型',
      dataIndex: 'productType',
      width: 60,
      align: 'center',
      show: ['specialGoods'].includes(subRuleType),
      render: (val) => <Tag color={TAG_COLOR_TYPE[val]}>{GOODS_CLASS_TYPE[val]}</Tag>,
    },
    {
      title: '商品信息',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PopImgShow url={val} width={60} />
          <div style={{ marginLeft: 5 }}>
            <Ellipsis length={10} tooltip>
              {row.goodsName}
            </Ellipsis>
            <div>{row.goodsId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '售价',
      dataIndex: 'sellPrice',
      align: 'right',
      show: ['specialGoods'].includes(subRuleType),
      render: (val, row) => (
        <div>
          <div>
            {
              {
                defaultMode: `¥${val}`,
                cashMode: `¥${val}`,
                self: `¥${val}+${row.sellBean}卡豆`,
                free: '免费',
              }[row.paymentModeType]
            }
          </div>
          <div
            style={{
              textDecoration: 'line-through',
              color: '#9e9e9e',
            }}
          >
            ¥{row.oriPrice}
          </div>
          {row.paymentModeType !== 'free' && ELECTRICGOODS_SELL_PRICE_TYPE[row.paymentModeType]}
        </div>
      ),
    },
    {
      title: '售价',
      dataIndex: 'sellPriceRange',
      align: 'right',
      show: ['commerceGoods'].includes(subRuleType),
      render: (val, row) => `${val}\n${ELECTRICGOODS_SELL_PRICE_TYPE[row.paymentModeType]}`,
    },
  ];

  //  有价券 表头
  const ownerCouponColumns = [
    {
      title: '券信息',
      fixed: 'center',
      dataIndex: 'couponName',
      render: (val, row) => (
        <div>
          <div>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>{`ID:${row.ownerCouponIdString}`}</div>
        </div>
      ),
    },
    {
      title: '售价',
      fixed: 'center',
      dataIndex: 'buyPrice',
      render: (val, row) => <div>￥{Number(val).toFixed(2)}</div>,
    },
  ];

  const listProps = {
    merchant: {
      getColumns: merchantGetColumns('userMerchantId'),
      id: 'userMerchantId',
    },
    group: {
      getColumns: merchantGetColumns('merchantGroupId'),
      id: 'merchantGroupId',
    },
    specialGoods: {
      getColumns: specialGoodsColumns,
      id: 'goodsId',
    },
    reduceCoupon: {
      getColumns: ownerCouponColumns,
      id: 'ownerCouponIdString',
    },
    commerceGoods: {
      getColumns: specialGoodsColumns,
      id: 'goodsId',
    },
  }[subRuleType];

  return (
    <>
      <DescriptionsCondition
        initialValues={detail}
        formItems={[...formItems, ...itemsProps]}
      ></DescriptionsCondition>
      {['merchant', 'group', 'specialGoods', 'reduceCoupon', 'commerceGoods'].includes(
        subRuleType,
      ) ? (
        <TableDataBlock
          noCard={false}
          scrollY={550}
          columns={listProps.getColumns || []}
          tableSize={'small'}
          rowKey={(record) => `${record[listProps.id]}`}
          params={{ ruleId }}
          dispatchType="couponRulesManage/fetchRuleDetailPage"
          list={ruleDetailListObj.ruleConditionsList}
          total={ruleDetailListObj.total}
        ></TableDataBlock>
      ) : null}
    </>
  );
};

export default connect(({ couponRulesManage }) => ({
  ruleDetailListObj: couponRulesManage.ruleDetailListObj,
}))(GoodsDetail);
