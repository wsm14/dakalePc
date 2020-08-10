import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { MATCH_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import MarketMatchMorningSet from './Morning/MarketMatchMorningSet';
import MarketMatchRuningSet from './Runing/MarketMatchRuningSet';

const MarketCardRMing = (props) => {
  const { marketCardRMing, loading, dispatch, setKey, matchType } = props;

  const childRef = useRef();
  const prop = { childRef, dispatch };
  const propInfo = {
    wakeUp: { payload: MarketMatchMorningSet(prop), title: '早起挑战赛' },
    step: { payload: MarketMatchRuningSet(prop), title: '步数挑战赛' },
  }[matchType];

  // 搜索参数
  const searchItems = [
    {
      label: '期数',
      type: 'datePicker',
      name: 'date',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '期数',
      align: 'center',
      dataIndex: 'startDate',
      render: (val) => `${val}期`,
    },
    {
      title: '报名卡豆',
      align: 'center',
      dataIndex: 'signBeanAmount',
    },
    {
      title: '已报名人数',
      align: 'center',
      dataIndex: 'signAmount',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '奖池卡豆',
      align: 'center',
      dataIndex: 'totalBeanAmount',
    },
    {
      title: '完成目标人数',
      align: 'center',
      dataIndex: 'targetUserAmount',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => MATCH_STATUS[val],
    },
  ];

  // 获取挑战卡豆详情
  const handleMorningDetail = () => {
    // dispatch({
    //   type: 'drawerForm/show',
    //   payload: MarketMatchMorningSet({
    //     dispatch,
    //     childRef,
    //   }),
    // });
  };

  // 设置挑战卡豆数
  const handleSetMatch = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: propInfo.payload,
    });
  };

  const btnExtra = [
    <Button className="dkl_green_btn" key="1" onClick={handleSetMatch}>
      设置
    </Button>,
  ];

  return (
    <DataTableBlock
      title={propInfo.title}
      extra={
        <Button className="dkl_orange_btn" key="2" onClick={() => setKey('home')}>
          返回
        </Button>
      }
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.startDate}`}
      btnExtra={btnExtra}
      params={{ matchType }}
      dispatchType="marketCardRMing/fetchGetList"
      {...marketCardRMing}
    >
    </DataTableBlock>
  );
};

export default connect(({ marketCardRMing, loading }) => ({
  marketCardRMing,
  loading: loading.models.marketCardRMing,
}))(MarketCardRMing);
