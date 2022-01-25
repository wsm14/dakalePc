import React from 'react';
import { connect } from 'umi';
import { CONPON_RULES_TYPE, PLATFORM_APPLY_PORT_TYPE, GOODS_CLASS_TYPE } from '@/common/constant';
import { Tag } from 'antd';
import { getCityName, checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { ruleId, detail = {}, dispath, ruleDetailListObj = {} } = props;
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
      title: '商品信息',
      fixed: 'center',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Tag color={row.goodsType === 'single' ? 'orange' : 'magenta'}>
                {GOODS_CLASS_TYPE[row.goodsType]}
              </Tag>
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ marginTop: 5 }}>{row[listProps.id]}</div>
          </div>
        </div>
      ),
    },
    {
      title: '售价',
      fixed: 'center',
      dataIndex: 'oriPrice',
      show: ['specialGoods'].includes(subRuleType),
      render: (val, row) => {
        return <div>￥{Number(row.realPrice).toFixed(2)}</div>;
      },
    },
    {
      title: '售价',
      dataIndex: 'paymentModeObject',
      show: ['commerceGoods'].includes(subRuleType),
      render: (val = {}, row) => (
        <div>
          {val.type === 'self'
            ? `${val.bean || 0} 卡豆 + ${val.cash || 0} 元`
            : `${row.realPrice || 0} 元`}
        </div>
      ),
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
      id: 'specialGoodsId',
    },
    reduceCoupon: {
      getColumns: ownerCouponColumns,
      id: 'ownerCouponIdString',
    },
    commerceGoods: {
      getColumns: specialGoodsColumns,
      id: 'specialGoodsId',
    },
  }[subRuleType];

  return (
    <>
      <DescriptionsCondition
        formItems={[...formItems, ...itemsProps]}
        initialValues={detail}
        // initialValues={{ ...detail, ...ruleDetailListObj }}
      ></DescriptionsCondition>
      {['merchant', 'group', 'specialGoods', 'reduceCoupon', 'commerceGoods'].includes(
        subRuleType,
      ) ? (
        <TableDataBlock
          noCard={false}
          columns={listProps.getColumns || []}
          rowKey={(record) => `${record[listProps.id]}`}
          params={{ ruleId: ruleId }}
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
