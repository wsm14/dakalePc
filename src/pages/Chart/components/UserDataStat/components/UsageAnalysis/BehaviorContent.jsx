import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import moment from 'moment';
import { Column, Line } from '@/components/Charts';
import { USER_ANALYSIS_TYPES } from '@/common/constant';
import SearchBlock from '../../../SearchBlock';

const BehaviorContent = (props) => {
  const { dispatch, loading, newRegisterDataObj } = props;
  const [data, setData] = useState({
    groupType: 'day',
    appType: 'app,weChat,mark,communityWechat',
    reportType: 'newRegister',
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
      type: 'userDataStat/fetchUserAnalysisReport',
      payload: data,
    });
  };

  const btnTypeProps = {
    newRegister: {
      allText: `累计：${newRegisterDataObj.total || '-'}    均值：${
        newRegisterDataObj.average || '-'
      }`,
      eCharts: (
        <Column
          data={newRegisterDataObj.dataList || []}
          xyField={{ xField: 'statisticDay', yField: 'value' }}
          legend={false}
          seriesField="type"
          isStack={true}
        />
      ),
    },
    payUser: {
      allText: `总支付人数均值：${newRegisterDataObj.payUserAverage || '-'}    首次支付人数均值：${
        newRegisterDataObj.firstPayUserAverage || '-'
      }`,
      eCharts: (
        <Line
          data={newRegisterDataObj.dataList || []}
          xyField={{ xField: 'statisticDay', yField: 'value' }}
          legend={false}
          seriesField="type"
        />
      ),
    },
    watchVideo: {
      allText: `均值：${newRegisterDataObj.watchVideoAverage || '-'}`,
      eCharts: (
        <Line
          data={newRegisterDataObj.dataList || []}
          xyField={{ xField: 'statisticDay', yField: 'value' }}
          legend={false}
          seriesField="type"
        />
      ),
    },
  }[data.reportType || 'newRegister'];

  return (
    <div>
      <SearchBlock
        data={data}
        setData={setData}
        btnObj={{
          newRegister: '新注册用户',
          payUser: '支付人数',
          watchVideo: '看视频用户',
        }}
        portTypeList={USER_ANALYSIS_TYPES}
        defaultPortType={['app', 'weChat', 'mark', 'communityWechat']}
        allText={btnTypeProps.allText}
      ></SearchBlock>
      {/* 图表 */}
      <Spin spinning={loading}>{btnTypeProps.eCharts}</Spin>
    </div>
  );
};

export default connect(({ userDataStat, loading }) => ({
  newRegisterDataObj: userDataStat.newRegisterDataObj,
  loading: loading.effects['userDataStat/fetchUserAnalysisReport'],
}))(BehaviorContent);
