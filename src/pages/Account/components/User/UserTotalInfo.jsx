import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const UserTotalInfo = ({ dispatch, loading, indata, outdata, userTotalIn, userTotalOut }) => {
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
  ];

  // 获取商户统计数据
  const fetchUserTotal = (values) => {
    dispatch({
      type: 'accountUser/fetchUserTotal',
      payload: values,
    });
  };

  useEffect(() => {
    fetchUserTotal();
  }, []);

  return (
    <Card style={{ marginBottom: 16 }}>
      <SearchCondition searchItems={searchItems} handleSearch={fetchUserTotal}></SearchCondition>
      <Spin spinning={!!loading}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            用户累计收益卡豆：{userTotalIn}
            <Donut
              key="chart1"
              data={indata}
              totalLabel="累计卡豆"
              height={276}
              angleField="content"
              colorField="statisticDesc"
            />
          </Col>
          <Col span={12}>
            用户累计消耗卡豆：{userTotalOut}
            <Donut
              key="chart2"
              data={outdata}
              totalLabel="累计卡豆"
              height={276}
              angleField="content"
              colorField="statisticDesc"
            />
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default connect(({ accountUser, loading }) => ({
  ...accountUser,
  loading: loading.effects['accountUser/fetchUserTotal'],
}))(UserTotalInfo);
