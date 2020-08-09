import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { MATCH_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';

const MarketCardMorningDetail = (props) => {
  const { marketCardMorning, loading, dispatch, setKey } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '用户ID',
      align: 'center',
      dataIndex: 'startDate',
      render: (val) => `${val}期`,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'signBeanAmount',
    },
    {
      title: '挑战状态',
      align: 'center',
      dataIndex: 'signAmount',
      render: (val) => MATCH_STATUS[val],
    },
    {
      title: '本期收益（卡豆）',
      align: 'center',
      dataIndex: 'totalBeanAmount',
      render: (val) => val || '--',
    },
    {
      title: '报名时间',
      align: 'center',
      dataIndex: 'targetUserAmount',
    },
    {
      title: '打卡时间',
      align: 'center',
      dataIndex: 'status',
      render: (val) => val || '--',
    },
  ];

  return (
    <DataTableBlock
      title={<>早起挑战赛-报名详情 期数：2020.07.22期 报名人数：120人 完成目标人数：100</>}
      extra={
        <Button className="dkl_orange_btn" key="2" onClick={setKey}>
          返回
        </Button>
      }
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.startDate}`}
      params={{ matchType: 'wakeUp' }}
      dispatchType="marketCardMorning/fetchGetList"
      {...marketCardMorning}
    ></DataTableBlock>
  );
};

export default connect(({ marketCardMorning, loading }) => ({
  marketCardMorning,
  loading: loading.models.marketCardMorning,
}))(MarketCardMorningDetail);
