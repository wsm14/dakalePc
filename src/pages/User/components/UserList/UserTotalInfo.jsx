import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Statistic, Card, Row, Col } from 'antd';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment().subtract(1, 'day');

const UserTotalInfo = ({ dispatch, loading, totalData, cityData }) => {
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

  const styles = { padding: 0 };

  return (
    <Card style={{ marginBottom: 16 }} bordered={false}>
      <SearchCondition
        searchItems={searchItems}
        handleSearch={(val) => setSerach(val)}
        initialValues={{
          beginDate: [dDate, dDate],
        }}
      ></SearchCondition>
      <Row gutter={16} align="middle">
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
