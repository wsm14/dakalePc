import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import moment from 'moment';
import { Column, Line } from '@/components/Charts';
import { USER_ANALYSIS_TYPES } from '@/common/constant';
import SearchBlock from '../SearchBlock';

const TrendAnalysis = (props) => {
  const { dispatch, loading, newRegisterDataObj } = props;
  const [data, setData] = useState({
    groupType: 'day',
    appType: 'app,weChat,mark,communityWechat',
    subStatisticType: 'onlookersNum',
    statisticType: 'momentTrendAnalysis',
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
      type: 'videoDataStat/fetchMomentTrendAnalysisReport',
      payload: data,
    });
  };

  return (
    <div style={{ paddingTop: 25 }}>
      <SearchBlock
        data={data}
        setData={setData}
        btnObj={{
          onlookersNum: '播放量',
          viewAmount: '完播量',
          gainBeanAmount: '用户领取卡豆数',
          viewUserAmount: '刷视频人数',
        }}
        btnObjKeyName="subStatisticType"
        portTypeList={USER_ANALYSIS_TYPES}
        defaultPortType={['app', 'weChat', 'mark', 'communityWechat']}
        allText={`累计：${newRegisterDataObj.total || '-'}    均值：${
          newRegisterDataObj.average || '-'
        }`}
      ></SearchBlock>
      {/* 图表 */}
      <Spin spinning={loading}>
        <Column
          data={newRegisterDataObj.dataList || []}
          xyField={{ xField: 'analysisDay', yField: 'value' }}
          legend={false}
          seriesField="type"
          isStack={true}
          maxColumnWidth={40}
        />
      </Spin>
    </div>
  );
};

export default connect(({ videoDataStat, loading }) => ({
  newRegisterDataObj: videoDataStat.newRegisterDataObj,
  loading: loading.effects['videoDataStat/fetchMomentTrendAnalysisReport'],
}))(TrendAnalysis);
