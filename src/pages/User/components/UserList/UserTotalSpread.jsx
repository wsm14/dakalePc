import React from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Spin, Empty } from 'antd';
import { Pie } from '@/components/Charts';

const UserTotalSpread = ({ loading, totalChartData }) => {
  const dataSex = [
    {
      type: '男',
      value: totalChartData.userGenderMale + totalChartData.userGenderUnknown || 0,
    },
    {
      type: '女',
      value: totalChartData.userGenderFemale || 0,
    },
  ];

  const styles = { padding: 10, height: 276 };
  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            <Pie data={totalChartData.age || []} title="年龄层" innerRadius={0.65} flipPage />
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
            {totalChartData.tag.length ? (
              <Pie data={totalChartData.tag || []} angleField="count" colorField="tag" flipPage />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 89 }} />
            )}
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default connect(({ userList, loading }) => ({
  totalChartData: userList.totalChartData,
  loading: loading.effects['userList/fetchUserChartTotal'],
}))(UserTotalSpread);
