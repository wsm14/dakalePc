import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const UserTotalInfo = ({ dispatch, loading, totalData, btnExtra }) => {
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
      type: '充值卡豆',
      value: totalData.all || 0,
    },
    {
      type: '看视频',
      value: totalData.all || 0,
    },
    {
      type: '看图文',
      value: totalData.all || 0,
    },
    {
      type: '到店打卡',
      value: totalData.all || 0,
    },
    {
      type: '圈层分佣',
      value: totalData.all || 0,
    },
    {
      type: '早起挑战',
      value: totalData.all || 0,
    },
    {
      type: '步数挑战',
      value: totalData.all || 0,
    },
  ];

  const data2 = [
    {
      type: '发布视频',
      value: totalData.all || 0,
    },
    {
      type: '发布图文',
      value: totalData.all || 0,
    },
    {
      type: '消费抵扣',
      value: totalData.all || 0,
    },
    {
      type: '预约预订',
      value: totalData.all || 0,
    },
    {
      type: '小店兑换',
      value: totalData.all || 0,
    },
    {
      type: '早起挑战',
      value: totalData.all || 0,
    },
    {
      type: '步数挑战',
      value: totalData.all || 0,
    },
  ];

  // 获取商户统计数据
  const fetchBusinessTotal = (userId) => {
    dispatch({
      type: 'accountUser/fetchUserTotal',
      payload: { userId },
    });
  };

  useEffect(() => {
    // fetchBusinessTotal()
  }, []);

  return (
    <Card style={{ marginBottom: 16 }}>
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchBusinessTotal}
        btnExtra={btnExtra}
      ></SearchCondition>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Spin spinning={!!loading}>
            <Donut data={data} totalLabel="累计收益卡豆" height={276} />
          </Spin>
        </Col>
        <Col span={12}>
          <Spin spinning={!!loading}>
            <Donut data={data2} totalLabel="累计消耗卡豆" height={276} />
          </Spin>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ accountUser, loading }) => ({
  totalData: accountUser.totalData,
  loading: loading.effects['accountUser/fetchUserTotal'],
}))(UserTotalInfo);
