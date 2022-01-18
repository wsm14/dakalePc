import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  CONPON_RULES_TYPE,
  PLATFORM_APPLY_PORT_TYPE,
  GOODS_CLASS_TYPE,
  BUSINESS_TYPE,
} from '@/common/constant';
import { getCityName, checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { detail = {}, dispath, ruleDetailListObj = {} } = props;
  const { ruleType = '', ruleId = '', subRuleType } = detail;

  // const initialValues = { ...detail, ...ruleDetailListObj };

  useEffect(() => {
    if (['tagRule'].includes(ruleType)) {
      dispath({
        type: 'couponRulesManage/fetchRuleDetailPage',
        payload: {
          ruleId: ruleId,
        },
      });
    }
  }, [ruleType]);

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
        name: 'remark',
      },
    ],
    merchantRule: [
      {
        label: '指定店铺',
        name: 'remark',
      },
    ],
    goodsRule: [
      {
        label: '指定商品',
        name: 'remark',
      },
    ],
    tagRule: [
      {
        label: '标签类型',
        name: 'subRuleType',
        render: (val) =>
          ({
            platformGoodsTags: '平台商品标签',
            merchantTags: '商家标签',
          }[val]),
      },
      {
        label: '指定商品标签',
        name: 'merchantTagsList',
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

  // // 店铺/集团 表头
  // const merchantGetColumns = [
  //   {
  //     title: '店铺类型',
  //     dataIndex: listProps.id,
  //     render: (val, row) =>
  //       subRuleType === 'group' ? '集团' : row.groupIdString ? '子门店' : '单店',
  //   },
  //   {
  //     title: '店铺名称',
  //     dataIndex: subRuleType === 'group' ? 'groupName' : 'merchantName',
  //   },
  //   {
  //     title: '店铺ID',
  //     dataIndex: listProps.id,
  //   },
  //   {
  //     title: '经营类目',
  //     dataIndex: 'topCategoryName',
  //     render: (val, row) => `${val}/${row.categoryName}`,
  //   },
  //   {
  //     title: '地区',
  //     dataIndex: 'districtCode',
  //     render: (val) => checkCityName(val),
  //   },
  // ];

  // // 特惠商品/电商品 表头
  // const specialGoodsColumns = [
  //   {
  //     title: '商品信息',
  //     fixed: 'left',
  //     dataIndex: 'goodsImg',
  //     render: (val, row) => (
  //       <div style={{ display: 'flex' }}>
  //         <PopImgShow url={val} />
  //         <div
  //           style={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             justifyContent: 'center',
  //             flex: 1,
  //             marginLeft: 5,
  //           }}
  //         >
  //           <div style={{ display: 'flex' }}>
  //             <Tag color={row.goodsType === 'single' ? 'orange' : 'magenta'}>
  //               {GOODS_CLASS_TYPE[row.goodsType]}
  //             </Tag>
  //             <Ellipsis length={10} tooltip>
  //               {row.goodsName}
  //             </Ellipsis>
  //           </div>
  //           <div style={{ display: 'flex', marginTop: 5 }}>
  //             <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
  //             <Ellipsis length={10} tooltip>
  //               {row.ownerName}
  //             </Ellipsis>
  //           </div>
  //           <div style={{ marginTop: 5 }}>{54516541654156}</div>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: '售价',
  //     dataIndex: 'oriPrice',
  //     render: (val, row) => {
  //       const zhe = (Number(row.realPrice) / Number(val)) * 10;
  //       return (
  //         <div>
  //           <div style={{ textDecoration: 'line-through', color: '#999999' }}>
  //             ￥{Number(val).toFixed(2)}
  //           </div>
  //           <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  //             <Tag color={'red'}>{`${zhe}`.substring(0, 4)}折</Tag>
  //             <div>￥{Number(row.realPrice).toFixed(2)}</div>
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  // ];

  // //  有价券 表头
  // const ownerCouponColumns = [
  //   {
  //     title: '券信息',
  //     fixed: 'left',
  //     dataIndex: 'couponName',
  //     render: (val, row) => (
  //       <div>
  //         <div>
  //           <Ellipsis length={10} tooltip>
  //             {val}
  //           </Ellipsis>
  //         </div>
  //         <div style={{ display: 'flex', marginTop: 5 }}>{`ID:${row.ownerCouponIdString}`}</div>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: '售价',
  //     align: 'right',
  //     dataIndex: 'buyPrice',
  //     render: (val, row) => <div>￥{Number(val).toFixed(2)}</div>,
  //   },
  // ];

  // const listProps = {
  //   merchant: {
  //     getColumns: merchantGetColumns,
  //     id: 'userMerchantIdString',
  //     list: 'userMerchantId',
  //   },
  //   group: {
  //     getColumns: merchantGetColumns,
  //     id: 'merchantGroupId',
  //     list: 'merchantGroupList',
  //   },
  //   specialGoods: {
  //     getColumns: specialGoodsColumns,
  //     id: 'specialGoodsId',
  //     list: 'specialGoodsList',
  //   },
  //   reduceCoupon: {
  //     getColumns: ownerCouponColumns,
  //     id: 'ownerCouponIdString',
  //     list: 'reduceCouponList',
  //   },
  //   commerceGoods: {
  //     getColumns: specialGoodsColumns,
  //     id: 'specialGoodsId',
  //     list: 'commerceGoodsList',
  //   },
  // }[subRuleType];

  return (
    <>
      <DescriptionsCondition
        formItems={[...formItems, ...itemsProps]}
        initialValues={detail}
      ></DescriptionsCondition>
      {/* {['merchantRule', 'goodsRule'].includes(ruleType) && (
        <TableDataBlock
          noCard={false}
          columns={listProps.getColumns}
          rowKey={(record) => `${record[listProps.id]}`}
          params={{ ruleId: ruleId }}
          dispatchType="couponRulesManage/fetchRuleDetailPage"
          list={ruleDetailListObj[listProps.list]}
          total={ruleDetailListObj.total}
        ></TableDataBlock>
      )} */}
    </>
  );
};

export default connect(({ couponRulesManage }) => ({
  ruleDetailListObj: couponRulesManage.ruleDetailListObj,
}))(GoodsDetail);
