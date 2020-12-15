import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Statistic } from 'antd';

const BusinessTotal = ({ dispatch, searchData, totalData }) => {
  // useEffect(() => {
  //   fetchGetTotalData(searchData);
  // }, [searchData]);

  // // 获取统计数据
  // const fetchGetTotalData = (payload = {}) => {
  //   dispatch({
  //     type: 'chartBlock/fetchChartBlockOrder',
  //     payload,
  //   });
  // };

  const orderArr = [
    {
      title: '店铺发布视频数',
      key: 'allTotal',
      tip: '平均发布视频数',
    },
    {
      title: '视频播放次数',
      key: 'scan',
      tip: '平均播放次数',
    },
    {
      title: '视频打赏卡豆数',
      key: 'verificationFee',
      tip: '视频平均打赏卡豆数',
    },
  ];

  const gridStyle = {
    width: '33.3%',
    height: 137,
    textAlign: 'center',
  };

  const allStyle = {
    display: 'inline-block',
    marginTop: 4,
    color: '#8f8f8f',
  };

  const checkData = (checkData, key, reData = 0) => {
    return checkData ? checkData[key] : reData;
  };

  return (
    <>
      {orderArr.map((item) => (
        <Card.Grid style={gridStyle} key={item.title}>
          <Statistic
            title={item.title}
            value={checkData(totalData[item.key], 'totalFee')}
            precision={2}
          />
          <span style={allStyle}>
            {item.tip}：{checkData(totalData[item.key], 'docCount')}
          </span>
        </Card.Grid>
      ))}
    </>
  );
};

export default connect(({ chartBlock }) => ({
  totalData: chartBlock.orderInfo,
}))(BusinessTotal);
