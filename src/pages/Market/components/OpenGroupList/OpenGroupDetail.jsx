import React from 'react';
import { Modal, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import { REWARD_TYPE } from '@/common/constant';
import robot from './img/robot.png';
import redEnvelop from './img/redEnvelop.png';
import goods from './img/goods.png';

const OpenGroupDetail = (props) => {
  const { visible = {}, onClose } = props;
  const { show = false, list = [] } = visible;

  const modalProps = {
    title: '拼团详情',
    visible: show,
    onCancel: onClose,
    width: 1000,
    footer: (
      <Button type="primary" onClick={onClose}>
        返回
      </Button>
    ),
  };

  const getColumns = [
    {
      title: '拼团用户',
      align: 'center',
      dataIndex: 'username',
      render: (val, row) =>
        row.orderSn ? (
          `${val}\n${row.mobile}`
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={robot} style={{ width: 20 }} alt="" />
              {val}
            </div>
            <div>{row.mobile}</div>
          </>
        ),
    },
    {
      title: '参团时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '订单号',
      align: 'center',
      dataIndex: 'orderSn',
    },
    {
      title: '拼团结果',
      align: 'center',
      dataIndex: 'rewardType',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {val === 'winGoods' ? (
            <img src={goods} style={{ width: 20 }} alt="" />
          ) : (
            <img style={{ width: 20 }} src={redEnvelop} alt="" />
          )}
          <span>{REWARD_TYPE[val]}</span>
        </div>
      ),
    },
    {
      title: '获得奖励',
      align: 'center',
      dataIndex: 'rewardValue',
      render: (val, row) => (row.rewardType == 'winGoods' ? `${val}卡豆` : `￥${val}`),
    },
  ];
  return (
    <Modal {...modalProps}>
      <TableDataBlock
        card={false}
        columns={getColumns}
        rowKey={(record) => `${record.orderSn}`}
        list={list}
      ></TableDataBlock>
    </Modal>
  );
};

export default OpenGroupDetail;
