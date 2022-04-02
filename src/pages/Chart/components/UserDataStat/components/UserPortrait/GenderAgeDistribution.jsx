import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Empty, Table } from 'antd';
import moment from 'moment';
import { Pie } from '@/components/Charts';
import TimeSearch from './TimeSearch/TimeSearch';

const GenderAgeDistribution = (props) => {
  const { dispatch, genderList, ageList } = props;

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

  const genderColumns = [
    {
      title: '性别',
      dataIndex: 'gender',
      align: 'center',
    },
    {
      title: '用户数',
      dataIndex: 'totalGenderUserNum',
      align: 'center',
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      align: 'center',
    },
  ];

  const ageColumns = [
    {
      title: '年龄',
      dataIndex: 'ageRange',
      align: 'center',
    },
    {
      title: '用户数',
      dataIndex: 'totalAgeUserNum',
      align: 'center',
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      align: 'center',
    },
  ];

  const genderProps = {
    innerRadius: 0.66,
    angleField: 'totalGenderUserNum',
    colorField: 'gender',
    legend: {
      position: 'bottom',
    },
  };

  const ageProps = {
    innerRadius: 0.66,
    angleField: 'totalAgeUserNum',
    colorField: 'ageRange',
    legend: {
      position: 'bottom',
    },
  };

  return (
    <div>
      <Card title="性别分布" bordered={false}>
        <TimeSearch data={genderData} setData={setGenderData}></TimeSearch>
        <Row style={{ minHeight: 300, marginTop: 35 }}>
          <Col span={14}>
            {genderList.length ? (
              <Pie data={genderList} {...genderProps} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>

          <Col span={10}>
            <Table
              pagination={false}
              rowKey="gender"
              columns={genderColumns}
              dataSource={genderList}
            />
          </Col>
        </Row>
      </Card>
      <Card title="年龄分布" bordered={false}>
        <TimeSearch data={ageData} setData={setAgeData}></TimeSearch>
        <Row style={{ minHeight: 300, marginTop: 35 }}>
          <Col span={14}>
            {ageList.length ? (
              <div style={{ height: 300 }}>
                <Pie data={ageList} {...ageProps} />
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>

          <Col span={10}>
            <Table pagination={false} rowKey="ageRange" columns={ageColumns} dataSource={ageList} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default connect(({ userDataStat }) => ({
  genderList: userDataStat.genderList,
  ageList: userDataStat.ageList,
}))(GenderAgeDistribution);
