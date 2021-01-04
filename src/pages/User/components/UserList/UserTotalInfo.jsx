import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Statistic, Card, Row, Col, Button } from 'antd';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment().subtract(1, 'day');

const UserTotalInfo = ({ dispatch, loading, totalData, currentUser }) => {
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

  const data = [
    {
      type: '今日新增实名用户',
      value: totalData.userAddRealNameCount || 0,
    },
    {
      type: '今日新增充值用户',
      value: totalData.userAddTopUpCount || 0,
    },
  ];

  // 获取用户详情
  const fetchUserTotal = (
    val = { beginDate: dDate.format('YYYY-MM-DD'), endDate: dDate.format('YYYY-MM-DD') },
  ) => {
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
    <Card style={{ marginBottom: 16 }} bordered={false}>
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchUserTotal}
        initialValues={{
          beginDate: [dDate, dDate],
        }}
      ></SearchCondition>
      <Row gutter={16} align="middle">
        {/* <Col span={12}>
          <Spin spinning={!!loading}>
            <Card bordered={false} bodyStyle={styles} style={{ height: 276 }}>
              <Pie data={data} height={276} />
            </Card>
          </Spin>
        </Col> */}
        <Col span={12}>
          <Card bordered={false} bodyStyle={styles} loading={loading} style={{ height: 100 }}>
            <Row gutter={[16, 16]} span={12} align="middle" style={{ height: 100, marginLeft: 10 }}>
              <Col span={8}>
                <Statistic
                  title="今日新增用户"
                  value={totalData.userAddRealNameCount + totalData.userAddTopUpCount}
                ></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总注册数" value={totalData.userTotalRegister}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总实名认证" value={totalData.userRealNameCount}></Statistic>
              </Col>
              {/* <Col span={8}>
                <Statistic title="总充值用户" value={totalData.userTopUpCount}></Statistic>
              </Col> */}
              {/* <Col span={8}>
                <Statistic title="今日新增充值用户" value={totalData.userAddTopUpCount}></Statistic>
              </Col> */}
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} bodyStyle={styles} loading={loading} style={{ height: 100 }}>
            <Row gutter={[16, 16]} span={12} align="middle" style={{ height: 100, marginLeft: 10 }}>
              <Col span={8}>
                <Statistic
                  title="总支付用户数"
                  value={totalData.userAddRealNameCount + totalData.userAddTopUpCount}
                ></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="总到店打卡数" value={totalData.userTotalRegister}></Statistic>
              </Col>
              {/* <Col span={8}>
                <Statistic title="总充值用户" value={totalData.userTopUpCount}></Statistic>
              </Col> */}
              {/* <Col span={8}>
                <Statistic title="今日新增充值用户" value={totalData.userAddTopUpCount}></Statistic>
              </Col> */}
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ userInfo, userList, loading }) => ({
  currentUser: userInfo.currentUser,
  totalData: userList.totalData,
  loading: loading.effects['userList/fetchUserTotal'],
}))(UserTotalInfo);
