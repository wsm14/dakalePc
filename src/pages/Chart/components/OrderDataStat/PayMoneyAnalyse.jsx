import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import { Pie } from '@/components/Charts';
import moment from 'moment';
import SearchBlock from '../SearchBlock';

const PayMoneyAnalyse = ({ payList, dispatch, loading }) => {
  const [data, setData] = useState({
    subStatisticType: 'payDevice',
    statisticType: 'orderPayMoneyAnalysis',
    startStatisticDay: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });

  // 监听数据变化发送请求
  useEffect(() => {
    dispatch({
      type: 'orderDataStat/fetchOrderPayAnalysisReport',
      payload: data,
    });
  }, [data]);

  return (
    <div style={{ paddingTop: 25 }}>
      <SearchBlock
        data={data}
        setData={setData}
        btnObj={{
          payDevice: '端口',
          payOrderType: '类型',
        }}
        btnObjKeyName="subStatisticType"
        timeDayMonthOk={false}
      ></SearchBlock>
      {/* 图表 */}
      <div style={{ maxWidth: '60%', marginTop: 25 }}>
        <Spin spinning={loading}>
          <Pie data={payList} title="支付金额" innerRadius={0.7} radius={0.8} />
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ orderDataStat, loading }) => ({
  payList: orderDataStat.payList,
  loading: loading.effects['orderDataStat/fetchOrderPayAnalysisReport'],
}))(PayMoneyAnalyse);
