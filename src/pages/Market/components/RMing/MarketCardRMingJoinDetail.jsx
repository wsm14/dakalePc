import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { MATCH_USER_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const MarketCardRMingJoinDetail = (props) => {
  const { marketCardRMing, loading, matchType, visible, setVisible } = props;

  const { type = '', record = '' } = visible;

  // table 表头
  const getColumns = [
    {
      title: '用户ID',
      align: 'center',
      dataIndex: 'userId',
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '挑战状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => MATCH_USER_STATUS[val],
    },
    {
      title: '本期收益（卡豆）',
      align: 'center',
      dataIndex: 'earnBeanAmount',
      render: (val) => val || '--',
    },
    {
      title: '报名时间',
      align: 'center',
      dataIndex: 'signDate',
    },
    {
      title: '步数',
      align: 'center',
      dataIndex: 'process',
      render: (val) => val || '--',
    },
  ];

  return (
    <Modal
      title={
        <>
          {{ wakeUp: '早起挑战赛 - ', step: '步数挑战赛 - ' }[matchType]} {record.startDate}期
          报名人数：{record.signAmount} 完成目标人数：
          {record.targetUserAmount}
        </>
      }
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <TableDataBlock
        noCard={false}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.userId}`}
        params={{ matchType, date: record.startDate }}
        dispatchType="marketCardRMing/fetchMarketMatchJoin"
        size="middle"
        {...marketCardRMing.joinList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ marketCardRMing, loading }) => ({
  marketCardRMing,
  loading: loading.effects['marketCardRMing/fetchMarketMatchJoin'],
}))(MarketCardRMingJoinDetail);
