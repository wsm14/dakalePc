import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import moment from 'moment';
import TimeSearch from './TimeSearch/TimeSearch';

const GenderAgeDistribution = (props) => {
  const { dispatch } = props;

  const [genderData, setGenderData] = useState({
    startStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    statisticType: 'userPortrait',
    subStatisticType: 'gender',
  });
  const [ageData, setAgeData] = useState({
    startStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    statisticType: 'userPortrait',
    subStatisticType: 'age',
  });

  useEffect(() => {
    dispatch({
      type: 'userDataStat/fetchUserStatisticReportGender',
      payload: genderData,
    });
  }, [genderData]);

  useEffect(() => {
    dispatch({
      type: 'userDataStat/fetchUserStatisticReportAge',
      payload: ageData,
    });
  }, [ageData]);

  return (
    <div>
      <Card title="性别分布" bordered={false}>
        <TimeSearch data={genderData} setData={setGenderData}></TimeSearch>
      </Card>
      <Card title="年龄分布" bordered={false}>
        <TimeSearch data={ageData} setData={setAgeData}></TimeSearch>
      </Card>
    </div>
  );
};

export default connect(({}) => ({}))(GenderAgeDistribution);
