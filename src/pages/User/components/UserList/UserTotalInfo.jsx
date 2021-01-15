import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Statistic, Card, Row, Col } from 'antd';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment().subtract(1, 'day');

const UserTotalInfo = ({ dispatch, loading, totalChartData: totalData, cityData }) => {
  const styles = { padding: 0 };
  const [search, setSerach] = useState({
    beginDate: dDate.format('YYYY-MM-DD'),
    endDate: dDate.format('YYYY-MM-DD'),
  });
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
      disabledDate: (current) => current && current > moment().endOf('day').subtract(1, 'day'),
    },
  ];

  // 获取用户详情
  const fetchUserTotal = () => {
    dispatch({
      type: 'userList/fetchUserTotal',
      payload: { ...search, ...cityData },
    });
  };

  useEffect(() => {
    fetchUserTotal();
  }, [cityData, search]);

  return (
    <Card style={{ marginBottom: 16 }} bordered={false}>
      <SearchCondition
        searchItems={searchItems}
        handleSearch={setSerach}
        initialValues={{
          beginDate: [dDate, dDate],
        }}
      ></SearchCondition>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Card bordered={false} bodyStyle={styles} loading={loading} style={{ height: 100 }}>
            <Row gutter={[16, 16]} span={12} align="middle" style={{ height: 100, marginLeft: 10 }}>
              <Col span={8}>
                <Statistic title="今日新增用户" value={totalData.todayAddUserCount}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总注册数" value={totalData.userTotalRegister}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总实名认证" value={totalData.userRealNameCount}></Statistic>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} bodyStyle={styles} loading={loading} style={{ height: 100 }}>
            <Row gutter={[16, 16]} span={12} align="middle" style={{ height: 100, marginLeft: 10 }}>
              <Col span={8}>
                <Statistic title="总支付用户数" value={totalData.userTopUpCount}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总到店打卡数" value={totalData.markCount}></Statistic>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ userList, loading }) => ({
  totalChartData: userList.totalChartData,
  loading: loading.effects['userList/fetchUserChartTotal'],
}))(UserTotalInfo);
