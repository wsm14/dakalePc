import React, { useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Card, Statistic } from 'antd';
import { ChartContext } from '../../chartStore';

/**
 * 店铺视频统计
 */
const BusinessTotal = ({ dispatch, totalData, loading }) => {
  const { searchData } = useContext(ChartContext);

  useEffect(() => {
    fetchChartBlockMreShare(searchData);
  }, [searchData]);

  // 获取统计数据
  const fetchChartBlockMreShare = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockMreShare',
      payload,
    });
  };

  const orderArr = [
    {
      title: '店铺发布视频数',
      key: 'send',
      tip: '平均发布视频数',
    },
    {
      title: '视频播放次数',
      key: 'view',
      tip: '平均播放次数',
    },
    {
      title: '视频打赏卡豆数',
      key: 'bean',
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
    <Card bordered={false} loading={loading} bodyStyle={{ padding: 0 }} style={{ marginTop: 20 }}>
      {orderArr.map((item) => (
        <Card.Grid style={gridStyle} key={item.title}>
          <Statistic
            title={item.title}
            value={checkData(totalData[item.key], 'totalFee')}
            precision={0}
          />
          <span style={allStyle}>
            {item.tip}：{checkData(totalData[item.key], 'docCount')}
          </span>
        </Card.Grid>
      ))}
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  totalData: chartBlock.mreShareTotal,
  loading: loading.effects['chartBlock/fetchChartBlockMreShare'],
}))(BusinessTotal);
