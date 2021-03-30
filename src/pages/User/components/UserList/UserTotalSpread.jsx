import React from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Spin, Empty } from 'antd';
import { Pie } from '@/components/Charts';

const UserTotalSpread = ({ loading, totalChartData }) => {
  const dataSex = [
    {
      type: '未知',
      value: totalChartData.userGenderUnknown || 0,
    },
    {
      type: '男',
      value: totalChartData.userGenderMale || 0,
    },
    {
      type: '女',
      value: totalChartData.userGenderFemale || 0,
    },
  ];

  const styles = { padding: 10, height: 296 };
  return (
    <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            <div style={{ height: 276 }}>
              <Pie data={totalChartData.age || []} title="年龄层" innerRadius={0.65} flipPage />
            </div>
          </Card>
        </Spin>
      </Col>
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            <div style={{ height: 276 }}>
              <Pie data={dataSex} title="性别" innerRadius={0.65} />
            </div>
          </Card>
        </Spin>
      </Col>
      <Col span={8}>
        <Spin spinning={!!loading}>
          <Card bordered={false} bodyStyle={styles}>
            {totalChartData.tag && totalChartData.tag.length ? (
              <div style={{ height: 276 }}>
                <Pie data={totalChartData.tag || []} angleField="count" colorField="tag" flipPage />
              </div>
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
