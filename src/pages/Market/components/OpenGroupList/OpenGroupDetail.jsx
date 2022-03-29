import React from 'react';
import { Modal, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const OpenGroupDetail = (props) => {
  const { visible = {} } = props;
  const { show = false, list = [] } = visible;

  const modalProps = {
    title: '拼团详情',
    visible: show,
    width: 1000,
    footer: <Button type="primary">返回</Button>,
  };

  const getColumns = [
    {
      title: '拼团用户',
      align: 'center',
      dataIndex: 'soldGoodsCount',
    },
    {
      title: '参团时间',
      align: 'center',
      dataIndex: 'soldGoodsCount',
    },
    {
      title: '订单号',
      align: 'center',
      dataIndex: 'soldGoodsCount',
    },
    {
      title: '拼团结果',
      align: 'center',
      dataIndex: 'soldGoodsCount',
    },
    {
      title: '获得奖励',
      align: 'center',
      dataIndex: 'soldGoodsCount',
    },
  ];
  return (
    <Modal {...modalProps}>
      <TableDataBlock
        card={false}
        columns={getColumns}
        rowKey={(record) => `${record.specialGoodsId}`}
        list={list}
      ></TableDataBlock>
    </Modal>
  );
};

export default OpenGroupDetail;
