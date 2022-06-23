import React, { useRef } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { ELECTRICGOODS_STATUS } from '@/common/constant';
import { BUSINESS_TYPE, GOODS_CLASS_TYPE, BANK_CHECK_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

// 特惠商品
const EnrollSpecialGoods = (props) => {
  const { dispatch, id, offlineGoods, loading } = props;

  const childRef = useRef();

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
      type: 'select',
      select: ELECTRICGOODS_STATUS,
    },
  ];

  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'relateName',
      render: (val, row) => (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
          <Ellipsis tooltip length={8} style={{ marginLeft: 5 }}>
            {val}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '参与活动商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <Ellipsis length={13} tooltip>
            {val}
          </Ellipsis>
          <div style={{ marginTop: 5 }}>{row.goodsId}</div>
        </div>
      ),
    },
    {
      title: '所属行业',
      align: 'center',
      dataIndex: 'relsateName',
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'priasce',
    },
    {
      title: '当前售价',
      align: 'center',
      dataIndex: 'pricde',
    },
    {
      title: '当前商家结算价',
      align: 'center',
      dataIndex: 'pricae',
    },
    {
      title: '活动售价',
      align: 'center',
      dataIndex: 'prdice',
    },
    {
      title: '活动结算价',
      align: 'center',
      dataIndex: 'prisce',
    },
    {
      title: '活动库存',
      align: 'center',
      dataIndex: 'price',
    },
  ];

  return (
    <TableDataBlock
      order
      noCard={false}
      tableSize="small"
      scroll={{ y: 400 }}
      cRef={childRef}
      loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      params={{ marketingActivityId: id }}
      rowKey={(row) => `${row.goodsId}`}
      dispatchType="marketActivity/fetchMarketActivityOfflineGoods"
      {...offlineGoods}
    ></TableDataBlock>
  );
};

export default connect(({ marketActivity, loading }) => ({
  offlineGoods: marketActivity.offlineGoods,
  loading: loading.effects['marketActivity/fetchMarketActivityOfflineGoods'],
}))(EnrollSpecialGoods);
