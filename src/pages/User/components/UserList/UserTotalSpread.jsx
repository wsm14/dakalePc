import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Spin } from 'antd';
import { Pie } from '@/components/Charts';

const UserTotalSpread = ({ dispatch, loading, totalData, totalInfo }) => {
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

  // 获取用户统计 信息爱好
  const fetchUserInfoTotal = () => {
    dispatch({
      type: 'userList/fetchUserInfoTotal',
    });
  };

  useEffect(() => {
    fetchUserTotalSperad();
    fetchUserInfoTotal();
  }, []);

  const styles = { padding: 20, height: 276 };

  return (
    <Row gutter={[16, 16]} align="middle">
      {/* <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
            <Pie data={dataCity} totalLabel="城市" height={276} />
          </Card>
        </Spin>
      </Col> */}
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            <Pie
              data={totalInfo.age || []}
              totalLabel="年龄层"
              height={276}
              radius={1}
              innerRadius={0.65}
            />
          </Card>
        </Spin>
      </Col>
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
            <Pie data={dataSex} totalLabel="性别" height={276} radius={1} innerRadius={0.65} />
          </Card>
        </Spin>
      </Col>
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
            <Pie
              data={totalInfo.tag || []}
              height={276}
              totalLabel="兴趣"
              angleField="count"
              colorField="tag"
              radius={1}
            />
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
