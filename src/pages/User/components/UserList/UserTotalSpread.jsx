import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';

const UserTotalSpread = ({ dispatch, loading, totalData }) => {
  const dataCity = totalData.city.map((item) => ({
    type: item.cityName == 'unknown' ? '未知' : item.cityName,
    value: item.count,
  }));

  const dataSex = [
    {
      type: '男',
      value: totalData.userGenderMale || 0,
    },
    {
      type: '女',
      value: totalData.userGenderFemale || 0,
    },
    {
      type: '未知',
      value: totalData.userGenderUnknown || 0,
    },
  ];

  // 获取用户统计
  const fetchUserTotalSperad = () => {
    dispatch({
      type: 'userList/fetchUserTotalSperad',
    });
  };

  useEffect(() => {
    fetchUserTotalSperad();
  }, []);

  const styles = { padding: 0 };

  return (
    <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
      <Col span={12}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
            <Donut data={dataCity} totalLabel="城市" />
          </Card>
        </Spin>
      </Col>
      <Col span={12}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
            <Donut data={dataSex} totalLabel="性别" />
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default connect(({ userList, loading }) => ({
  totalData: userList.totalSperadData,
  loading: loading.effects['userList/fetchUserTotalSperad'],
}))(UserTotalSpread);
