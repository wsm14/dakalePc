import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Spin } from 'antd';
import { Pie } from '@/components/Charts';

const UserTotalSpread = ({ dispatch, cityData, loading, totalData, totalInfo }) => {
  const dataSex = [
    {
      type: '男',
      value: totalData.userGenderMale + totalData.userGenderUnknown || 0,
    },
    {
      type: '女',
      value: totalData.userGenderFemale || 0,
    },
  ];

  // 获取用户统计
  const fetchUserTotalSperad = () => {
    dispatch({
      type: 'userList/fetchUserTotalSperad',
    });
  };

  // 获取用户统计 信息爱好
  const fetchUserInfoTotal = () => {
    dispatch({
      type: 'userList/fetchUserInfoTotal',
    });
  };

  useEffect(() => {
    fetchUserTotalSperad();
    fetchUserInfoTotal();
  }, [cityData]);

  const styles = { padding: 10, height: 276 };

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            <Pie data={totalInfo.age || []} title="年龄层" innerRadius={0.65} flipPage />
          </Card>
        </Spin>
      </Col>
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            <Pie data={dataSex} title="性别" innerRadius={0.65} />
          </Card>
        </Spin>
      </Col>
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            <Pie data={totalInfo.tag || []} angleField="count" colorField="tag" flipPage />
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default connect(({ userList, loading }) => ({
  totalData: userList.totalSperadData,
  totalInfo: userList.totalInfo,
  loading: loading.effects['userList/fetchUserTotalSperad'],
}))(UserTotalSpread);
