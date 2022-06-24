import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { BUSINESS_TYPE, BUSINESS_SALE_TYPE, TAG_COLOR_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import NumberValueSet from '@/components/FormListCondition/NumberValueSet';

// 特惠商品
const EnrollSpecialGoods = (props) => {
  const { dispatch, id, tableRef, offlineGoods, tradeList, fetchUpdateRemain, loading } = props;

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 获取行业类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '所属店铺',
      name: 'relateId',
      type: 'merchant',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },

    {
      label: '所属行业',
      name: 'categoryId',
      type: 'cascader',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
    },
  ];

  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'relateName',
      width: 170,
      render: (val, row) => (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Tag color={TAG_COLOR_TYPE[val]}>{BUSINESS_TYPE[row.relateType]}</Tag>
          <Ellipsis tooltip length={8} style={{ marginLeft: 5 }}>
            {val}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '参与活动商品名称/ID',
      dataIndex: 'goodsName',
      width: 160,
      render: (val, row) => (
        <>
          <Ellipsis length={13} tooltip>
            {val}
          </Ellipsis>
          <div>{row.goodsId}</div>
        </>
      ),
    },
    {
      title: '所属行业',
      dataIndex: 'categoryName',
    },
    {
      title: '活动时间',
      align: 'right',
      dataIndex: 'activityTimeRule',
      render: (val, row) =>
        ({ fixed: `${row.activityStartDate}\n~${row.activityEndDate}`, infinite: '长期' }[val]),
    },
    {
      title: '当前售价',
      align: 'right',
      width: 160,
      dataIndex: 'sellPrice',
      render: (val, row) =>
        `${
          { defaultMode: val, cashMode: val, self: `${val}+${row.sellBean}`, free: '免费' }[
            row.payType
          ]
        }\n${BUSINESS_SALE_TYPE[row.payType]}`,
    },
    {
      title: '当前商家结算价',
      align: 'right',
      dataIndex: 'settlePrice',
      width: 120,
    },
    {
      title: '活动售价',
      align: 'right',
      dataIndex: 'activitySellPrice',
      render: (val, row) =>
        ({
          defaultMode: val,
          cashMode: val,
          self: `${val}+${row.activitySellBean}`,
          free: '免费',
        }[row.payType]),
    },
    {
      title: '活动结算价',
      align: 'right',
      dataIndex: 'activitySettlePrice',
    },
    {
      title: '活动库存',
      align: 'right',
      fixed: 'right',
      dataIndex: 'activityRemain',
      render: (val, row) => (
        <NumberValueSet
          value={val}
          valueKey="activityTotal"
          loading={loading}
          inputProps={{ min: 0, precision: 0 }}
          onSubmit={(number) =>
            fetchUpdateRemain({
              ownerId: row.ownerId,
              goodsId: row.goodsId,
              marketingActivityId: id,
              goodsType: 'specialGoods',
              skuList: [
                {
                  skuId: row.skuId,
                  ...number,
                },
              ],
            })
          }
        ></NumberValueSet>
      ),
    },
  ];

  return (
    <div style={{ width: 1050 }}>
      <TableDataBlock
        order
        noCard={false}
        cRef={tableRef}
        loading={loading}
        tableSize="small"
        columns={getColumns}
        searchItems={searchItems}
        scroll={{ x: 1250, y: 400 }}
        rowKey={(row) => `${row.goodsId}`}
        params={{ marketingActivityId: id }}
        dispatchType="marketActivity/fetchMarketActivityOfflineGoods"
        {...offlineGoods}
      ></TableDataBlock>
    </div>
  );
};

export default connect(({ sysTradeList, marketActivity, loading }) => ({
  tradeList: sysTradeList.list.list,
  offlineGoods: marketActivity.offlineGoods,
  loading:
    loading.effects['marketActivity/fetchMarketActivityOfflineGoods'] ||
    loading.effects['marketActivity/fetchMarketActivityGoodsEditRemain'],
}))(EnrollSpecialGoods);
