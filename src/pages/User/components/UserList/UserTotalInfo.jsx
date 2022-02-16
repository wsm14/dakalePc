import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Statistic, Card, Row, Col } from 'antd';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment();

const UserTotalInfo = ({
  dispatch,
  loading,
  totalUserData,
  totalChartData: totalData,
  cityData,
}) => {
  const styles = { padding: '0 0 0 12px' };
  const [search, setSerach] = useState({
    beginDate: dDate.format('YYYY-MM-DD'),
    endDate: dDate.format('YYYY-MM-DD'),
  });
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'beginTime',
      end: 'endTime',
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
        handleSearch={(val) => setSerach(val)}
        initialValues={{
          beginDate: [dDate, dDate],
        }}
      ></SearchCondition>
      <Row gutter={16} align="middle">
        <Col span={8}>
          <Card
            bordered={false}
            bodyStyle={styles}
            loading={loading.effects['userList/fetchUserChartTotal']}
            style={{ borderRight: '1px solid #d2d2d2' }}
          >
            <Row gutter={[16, 16]} span={10} align="middle">
              <Col span={12}>
                <Statistic title="累计注册数" value={totalData.userTotalRegister}></Statistic>
              </Col>
              <Col span={12}>
                <Statistic title="累计实名认证" value={totalData.userRealNameCount}></Statistic>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={16}>
          <Card
            bordered={false}
            bodyStyle={styles}
            loading={loading.effects['userList/fetchUserTotal']}
          >
            <Row gutter={[16, 16]} span={14} align="middle">
              <Col span={6}>
                <Statistic title="注册数" value={totalUserData.userRegister}></Statistic>
              </Col>
              <Col span={6}>
                <Statistic title="实名认证" value={totalUserData.userRealCount}></Statistic>
              </Col>
              <Col span={6}>
                <Statistic title="支付用户数" value={totalUserData.userTopUpCount}></Statistic>
              </Col>
              <Col span={6}>
                <Statistic title="到店打卡用户数" value={totalUserData.markCount}></Statistic>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ userList, loading }) => ({
  totalUserData: userList.totalData,
  totalChartData: userList.totalChartData,
  loading,
}))(UserTotalInfo);
