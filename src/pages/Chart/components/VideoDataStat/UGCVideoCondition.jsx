import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import moment from 'moment';
import { Column, Line } from '@/components/Charts';
import SearchBlock from '../SearchBlock';

const UGCVideoCondition = ({ rewardList, dispatch, loading }) => {
  const [data, setData] = useState({
    groupType: 'day',
    statisticType: 'momentRewardAnalysis',
    subStatisticType: 'momentReward',
    startStatisticDay: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });

  // 监听数据变化发送请求
  useEffect(() => {
    data && fetchSearch();
  }, [data]);

  // 请求接口
  const fetchSearch = () => {
    dispatch({
      type: 'videoDataStat/fetchMomentRewardAnalysisReport',
      payload: data,
    });
  };

  return (
    <div style={{ paddingTop: 25 }}>
      <SearchBlock
        data={data}
        setData={setData}
        allText={`累计打赏卡豆数：${rewardList.total || '-'}`}
      ></SearchBlock>
      {/* 图表 */}
      <div style={{ marginTop: 25 }}>
        <Spin spinning={loading}>
          <Column
            data={rewardList.list || []}
            xyField={{ xField: 'analysisDay', yField: 'value' }}
            seriesField="type"
            isGroup={true}
            maxColumnWidth={40}
          />
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ videoDataStat, loading }) => ({
  rewardList: videoDataStat.rewardList,
  loading: loading.effects['videoDataStat/fetchMomentRewardAnalysisReport'],
}))(UGCVideoCondition);
