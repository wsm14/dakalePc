import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import { Pie } from '@/components/Charts';
import moment from 'moment';
import SearchBlock from '../SearchBlock';

const PlayAnalysis = ({ playList, dispatch, loading }) => {
  const [data, setData] = useState({
    subStatisticType: 'pgcMoment',
    statisticType: 'momentPlayAnalysis',
    startStatisticDay: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });

  // 监听数据变化发送请求
  useEffect(() => {
    dispatch({
      type: 'videoDataStat/fetchMomentPlayAnalysisReport',
      payload: data,
    });
  }, [data]);

  return (
    <div style={{ paddingTop: 25 }}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>各端口视频观看情况占比（完播）</div>
      <SearchBlock
        data={data}
        setData={setData}
        btnObj={{
          pgcMoment: 'PGC视频',
          ugcMoment: 'UGC视频',
          advertMoment: '广告视频',
          sdkMoment: 'SDK视频',
        }}
        btnObjKeyName="subStatisticType"
        timeDayMonthOk={false}
      ></SearchBlock>
      {/* 图表 */}
      <div style={{ maxWidth: '60%', marginTop: 25 }}>
        <Spin spinning={loading}>
          <Pie data={playList} title="完播量" innerRadius={0.6} />
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ videoDataStat, loading }) => ({
  playList: videoDataStat.playList,
  loading: loading.effects['videoDataStat/fetchMomentPlayAnalysisReport'],
}))(PlayAnalysis);
