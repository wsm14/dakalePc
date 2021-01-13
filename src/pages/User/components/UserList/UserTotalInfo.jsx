import React from 'react';
import { connect } from 'umi';
import { Statistic, Card, Row, Col } from 'antd';

const UserTotalInfo = ({ loading, totalChartData: totalData }) => {
  const styles = { padding: 0 };

  return (
    <Card style={{ marginBottom: 16 }} bordered={false}>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Card bordered={false} bodyStyle={styles} loading={loading} style={{ height: 100 }}>
            <Row gutter={[16, 16]} span={12} align="middle" style={{ height: 100, marginLeft: 10 }}>
              <Col span={8}>
                <Statistic
                  title="今日新增用户"
                  value={totalData.todayAddUserCount}
                ></Statistic>
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
                <Statistic
                  title="总支付用户数"
                  value={totalData.userTopUpCount}
                ></Statistic>
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
