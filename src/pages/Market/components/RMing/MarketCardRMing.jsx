import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { MATCH_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import MarketRMTotalInfo from './MarketRMTotalInfo';
import MarketMatchMorningSet from './MarketMatchMorningSet';
import MarketMatchRuningSet from './MarketMatchRuningSet';
import MarketCardRMingJoinDetail from './MarketCardRMingJoinDetail';

const MarketCardRMing = (props) => {
  const { marketCardRMing, title, loading, dispatch, setKey, matchType } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  const prop = { childRef, dispatch };

  const columns = [
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
      render: (val, record) => (val ? <a onClick={() => setVisible({ record })}>{val}</a> : '--'),
    },
    {
      title: '奖池卡豆',
      align: 'center',
      dataIndex: 'totalBeanAmount',
    },
  ];

  const propInfo = {
    wakeUp: {
      title: '早起挑战赛',
      payload: MarketMatchMorningSet(prop),
      getColumns: [
        ...columns,
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
      ],
    },
    step: {
      title: '步数挑战赛',
      payload: MarketMatchRuningSet(prop),
      getColumns: [
        ...columns,
        {
          title: '目标步数（步）',
          align: 'center',
          dataIndex: 'to2talBeanAmount',
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
      ],
    },
  }[matchType];

  // 搜索参数
  const searchItems = [
    {
      label: '期数',
      type: 'datePicker',
      name: 'date',
    },
  ];

  // 获取挑战卡豆详情
  const handleMorningDetail = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: MarketMatchMorningSet({
        dispatch,
        childRef,
      }),
    });
  };

  // 设置挑战卡豆数
  const handleSetMatch = () => {
    // dispatch({
    //   type: 'marketCardRMing/fetchMarketMatchJoin',
    //   payload: propInfo.payload,
    // });
  };

  // 头部添加面包屑 按钮
  const handlePageShowBtn = () => {
    dispatch({
      type: 'global/saveTitle',
      payload: {
        pageTitle: [title],
        pageBtn: [
          <Button type="danger" key="btn" onClick={handlePageBtnBack}>
            返回
          </Button>,
        ],
      },
    });
  };

  // 头部添加按钮返回
  const handlePageBtnBack = () => {
    setKey('home');
    dispatch({
      type: 'global/closeTitle',
    });
  };

  useEffect(() => {
    handlePageShowBtn();
  }, []);

  const btnExtra = [
    <Button className="dkl_green_btn" key="1" onClick={handleSetMatch}>
      设置
    </Button>,
  ];

  return (
    <>
      <MarketRMTotalInfo matchType={matchType} />
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        btnExtra={btnExtra}
        columns={propInfo.getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.startDate}`}
        params={{ matchType }}
        dispatchType="marketCardRMing/fetchGetList"
        {...marketCardRMing.matchList}
      ></DataTableBlock>
      <MarketCardRMingJoinDetail matchType={matchType} visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ marketCardRMing, loading }) => ({
  marketCardRMing,
  loading: loading.models.marketCardRMing,
}))(MarketCardRMing);
