import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Statistic, Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const UserTotalInfo = ({ dispatch, loading, totalData }) => {
  const [shwoTime, setShowTime] = useState(true);
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
  ];

  const data = [
    {
      type: '实名用户',
      value: totalData.userAddRealNameCount || 0,
    },
    {
      type: '充值用户',
      value: totalData.userAddTopUpCount || 0,
    },
  ];

  // 获取用户详情
  const fetchUserTotal = (val = {}) => {
    const { beginDate = '' } = val;
    setShowTime(!beginDate);
    dispatch({
      type: 'userList/fetchUserTotal',
      payload: val,
    });
  };

  useEffect(() => {
    fetchUserTotal();
  }, []);

  const styles = { padding: 0 };

  return (
    <Card style={{ marginBottom: 16 }}>
      <SearchCondition searchItems={searchItems} handleSearch={fetchUserTotal}></SearchCondition>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Spin spinning={!!loading}>
            <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
              <Donut
                data={data}
                height={295}
                description={{
                  visible: shwoTime,
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
                <Statistic title="总注册数" value={totalData.userTotalRegister}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总实名认证" value={totalData.userRealNameCount}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总充值用户" value={totalData.userTopUpCount}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic
                  title="今日新增实名用户"
                  value={totalData.userAddRealNameCount}
                ></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="今日新增充值用户" value={totalData.userAddTopUpCount}></Statistic>
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
