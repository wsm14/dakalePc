import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import OpenGroupDetail from './components/OpenGroupList/OpenGroupDetail';

const OpenGroupList = (props) => {
  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '拼团ID',
      name: 'platformCouponId',
    },
    {
      label: '发起人',
      name: 'useScenesType',
    },
    {
      label: '开团时间',
      type: 'rangePicker',
      name: 'updateTimeBegin',
      end: 'updateTimeEnd',
    },
    {
      label: '拼团状态',
      type: 'select',
      name: 'couponStatus',
    },
  ];

  const getColumns = [
    {
      title: '商品名称',
      fixed: 'left',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
        </div>
      ),
    },
    {
      title: '商品价格',
      align: 'center',
      dataIndex: 'paymentModeObject',
    },
    {
      title: '发起人',
      align: 'center',
      dataIndex: 'useStartTime',
      render: (val, row) => {},
    },
    {
      title: '开团时间',
      align: 'center',
      dataIndex: 'activityStartTime',
    },
    {
      title: '参团人数',
      align: 'center',
      dataIndex: 'remain',
    },
    {
      title: '剩余时间',
      align: 'center',
      dataIndex: 'soldGoodsCount',
    },
    {
      title: '拼团状态',
      align: 'center',
      dataIndex: 'writeOffGoodsCount',
    },
    {
      type: 'handle',
      dataIndex: 'specialGoodsId',
      width: 150,
      render: (val, record, index) => {
        return [
          {
            type: 'info',
            title: '拼团详情',
            click: () => fetchDetail(val),
          },
          {
            type: 'info',
            title: '立即成团',
            popText: '确定要立即成团吗？立即成团后将在已参与的用户中随机抽取3位用户拼中商品。',
            // click: () => fetchSpecialGoodsDetail(index, 'info'),
          },
        ];
      },
    },
  ];

  const fetchDetail = () => {
    setVisible({
      show: true,
      list: [],
    });
  };

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        //   loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType="specialGoods/fetchGetList"
      ></TableDataBlock>
      <OpenGroupDetail visible={visible} onClose={() => setVisible(false)}></OpenGroupDetail>
    </>
  );
};

export default connect(({}) => ({}))(OpenGroupList);
