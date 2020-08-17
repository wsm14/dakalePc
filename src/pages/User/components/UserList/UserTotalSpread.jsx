import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';

const UserTotalSpread = ({ dispatch, loading, totalData }) => {
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'mobile',
    },
  ];

  const data = [
    {
      type: '杭州',
      value: totalData.all || 0,
    },
    {
      type: '北京',
      value: totalData.all || 0,
    },
    {
      type: '上海',
      value: totalData.all || 0,
    },
  ];

  const data2 = [
    {
      type: '男',
      value: totalData.all || 0,
    },
    {
      type: '女',
      value: totalData.all || 0,
    },
    {
      type: '未知',
      value: totalData.all || 0,
    },
  ];

  // 获取用户详情
  const fetchUserDetail = (userId) => {
    dispatch({
      type: 'userList/fetchUserTotal',
      payload: { userId },
      callback: handleShowUserDetail,
    });
  };

  useEffect(() => {}, []);

  const styles = { padding: 0 };

  return (
    <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
      <Col span={12}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
            <Donut data={data} totalLabel="城市"/>
          </Card>
        </Spin>
      </Col>
      <Col span={12}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
            <Donut data={data2} totalLabel="性别"/>
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
