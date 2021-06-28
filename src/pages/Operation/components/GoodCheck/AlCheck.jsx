import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { CHECK_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

// 已审核
const AlCheck = (props) => {
  const { tabkey, globalColum = [], globalSearch, loading, specialGoods } = props;
  const childRef = useRef();

  const searchItems = [
    ...globalSearch,

    {
      label: '审核结果',
      name: 'ownerType',
      type: 'select',
      select: CHECK_STATUS,
    },
  ];

  const getColumns = [
    ...globalColum,
    {
      title: '审核时间',
      dataIndex: 'checkTime',
    },
    {
      title: '审核结果',
      dataIndex: 'checkTime',
    },
    {
      title: '驳回原因',
      dataIndex: 'checkTime',
    },
    {
      type: 'handle',
      dataIndex: 'id',
      render: (val, record) => {
        return [
            {
                type:'info',
                title:"详情"
            }
        ];
      },
    },
  ];

  return (
    <TableDataBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.specialGoodsId}`}
      dispatchType="specialGoods/fetchGetList"
      {...specialGoods}
    ></TableDataBlock>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(AlCheck);
