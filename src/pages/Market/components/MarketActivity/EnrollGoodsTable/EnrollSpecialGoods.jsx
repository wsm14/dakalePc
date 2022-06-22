import React, { useRef } from 'react';
import { connect } from 'umi';
import { ELECTRICGOODS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

// 特惠商品
const EnrollSpecialGoods = (props) => {
  const { dispatch, offlineGoods, loading } = props;

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
      name: 'statuss',
      type: 'select',
      select: ELECTRICGOODS_STATUS,
    },
  ];

  const getColumns = [
    {
      title: '商品主图',
      align: 'center',
      dataIndex: 'goodsImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称/ID',
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
      title: '店铺',
      align: 'center',
      dataIndex: 'relateName',
      render: (val, row) => (
        <div>
          <div style={{ marginTop: 5 }}>{row.categoryName || '--'}</div>
          <Ellipsis length={8} tooltip>
            {val || '--'}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '零售价',
      align: 'center',
      dataIndex: 'price',
    },
  ];

  return (
    <TableDataBlock
      noCard={false}
      tableSize="small"
      scroll={{ y: 400 }}
      cRef={childRef}
      loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      params={{ goodsTagId: 'id' }}
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
