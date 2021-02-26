import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import { MATCH_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import MarketRMTotalInfo from './MarketRMTotalInfo';
import MarketMatchMorningSet from './MarketMatchMorningSet'; //早起挑战赛
import MarketMatchRuningSet from './MarketMatchRuningSet'; //步数挑战赛
import MarketCardRMingJoinDetail from './MarketCardRMingJoinDetail';

const MarketCardRMing = (props) => {
  const { marketCardRMing, title, loading, dispatch, setKey, matchType } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');
  const [visibleMoring, setVisibleMoring] = useState(false);
  const [visibleRun, setVisibleRun] = useState(false);

  const prop = { childRef, dispatch };

  // 搜索参数
  const searchItems = [
    {
      label: '期数',
      type: 'datePicker',
      name: 'date',
    },
  ];

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
      getColumns: [
        ...columns,
        {
          title: '完成目标人数',
          align: 'center',
          dataIndex: 'targetUserAmount',
          render: (val) => val,
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
      getColumns: [
        ...columns,
        {
          title: '目标步数（步）',
          align: 'center',
          dataIndex: 'stepNumber',
        },
        {
          title: '完成目标人数',
          align: 'center',
          dataIndex: 'targetUserAmount',
          render: (val) => val,
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

  // 设置挑战卡豆数
  const handleSetMatch = () => {
   
    if(matchType==='wakeUp'){
      setVisibleMoring(true)
    }
    if(matchType==='step'){
      setVisibleRun(true)
    }
    

    // dispatch({
    //   type: 'drawerForm/show',
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

  const btnExtra = (
    <AuthConsumer auth="set">
      <Button className="dkl_green_btn" key="1" onClick={handleSetMatch}>
        设置
      </Button>
    </AuthConsumer>
  );
  return (
    <>
      <MarketRMTotalInfo matchType={matchType} />
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        btnExtra={btnExtra}
        columns={propInfo.getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.startDate}`}
        params={{ matchType, limit: 2 }}
        dispatchType="marketCardRMing/fetchGetList"
        {...marketCardRMing.matchList}
      ></TableDataBlock>
      <MarketCardRMingJoinDetail matchType={matchType} visible={visible} setVisible={setVisible} />
      {/* 早起挑战赛 */}
      <MarketMatchMorningSet visible={visibleMoring}  childRef={childRef} onClose={()=>setVisibleMoring(false)}></MarketMatchMorningSet>
      {/* 步数挑战赛 */}
      <MarketMatchRuningSet visible={visibleRun} childRef={childRef} onClose={()=>setVisibleRun(false)}></MarketMatchRuningSet>
    </>
  );
};

export default connect(({ marketCardRMing, loading }) => ({
  marketCardRMing,
  loading: loading.models.marketCardRMing,
}))(MarketCardRMing);
