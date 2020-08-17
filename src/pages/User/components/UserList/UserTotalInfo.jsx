import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Statistic, Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const UserTotalInfo = ({ dispatch, loading, totalData }) => {
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'mobile',
      end: 'mobileend'
    },
  ];

  const data = [
    {
      type: '实名用户',
      value: totalData.all || 0,
    },
    {
      type: '充值用户',
      value: totalData.all || 0,
    },
  ];

  // 获取用户详情
  const fetchUserDetail = (val) => {
    console.log(val);
    // dispatch({
    //   type: 'userList/fetchUserTotal',
    //   payload: { userId },
    //   callback: handleShowUserDetail,
    // });
  };

  useEffect(() => {}, []);

  const styles = { padding: 0 };

  return (
    <Card style={{ marginBottom: 16 }}>
      <SearchCondition searchItems={searchItems} handleSearch={fetchUserDetail}></SearchCondition>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Spin spinning={!!loading}>
            <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
              <Donut
                data={data}
                height={295}
                description={{
                  visible: true,
                  text: '今日新增',
                  alignTo: 'right',
                }}
              />
            </Card>
          </Spin>
        </Col>
        <Col span={12} style={{ borderLeft: '1px solid #ececec', paddingLeft: 50 }}>
          <Card bordered={false} bodyStyle={styles} loading={loading}>
            <Row gutter={[16, 16]} span={12} align="middle" style={{ height: 276 }}>
              <Col span={8}>
                <Statistic title="总注册数" value={totalData.all}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总实名认证" value={totalData.all}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总充值用户" value={totalData.all}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="今日新增实名用户" value={totalData.all}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="今日新增充值用户" value={totalData.all}></Statistic>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ userList, loading }) => ({
  totalData: userList.totalData,
  loading: loading.effects['userList/fetchUserTotal'],
}))(UserTotalInfo);
