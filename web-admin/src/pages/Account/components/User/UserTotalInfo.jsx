import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Card, Row, Col, Spin } from 'antd';
import { Pie } from '@/components/Charts';
import QuestionTooltip from '@/components/QuestionTooltip';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment().subtract(1, 'day');

const UserTotalInfo = ({
  dispatch,
  loading,
  indata,
  outdata,
  userTotalBean,
  userTotalIn,
  userTotalOut,
}) => {
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
  ];

  // 获取店铺统计数据
  const fetchUserTotal = (
    values = { beginDate: dDate.format('YYYY-MM-DD'), endDate: dDate.format('YYYY-MM-DD') },
  ) => {
    dispatch({
      type: 'accountUser/fetchAccountUserTotal',
      payload: values,
    });
  };

  useEffect(() => {
    fetchUserTotal();
  }, []);

  const chaerProps = {
    title: '累计卡豆',
    innerRadius: 0.6,
    angleField: 'content',
    colorField: 'statisticDesc',
  };

  return (
    <Card
      style={{ marginBottom: 16 }}
      title={
        <>
          <QuestionTooltip
            placement="bottom"
            title="总卡豆余额"
            overlayStyle={{ maxWidth: 300 }}
            content={'实时统计，不随时间搜索变化'}
          ></QuestionTooltip>
          ：{userTotalBean}
        </>
      }
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchUserTotal}
        initialValues={{
          beginDate: [dDate, dDate],
        }}
      ></SearchCondition>
      <Spin spinning={!!loading}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <QuestionTooltip
              placement="bottom"
              title="用户累计收益卡豆"
              overlayStyle={{ maxWidth: 300 }}
              content={'默认统计到昨日，随时间搜索变化'}
            ></QuestionTooltip>
            ：{userTotalIn}
            <div style={{ height: 250 }}>
              <Pie key="chart1" data={indata} {...chaerProps} />
            </div>
          </Col>
          <Col span={12}>
            <QuestionTooltip
              placement="bottom"
              title="用户累计消费"
              overlayStyle={{ maxWidth: 300 }}
              content={'用户累计消耗卡豆'}
            ></QuestionTooltip>
            ：{userTotalOut}
            <div style={{ height: 250 }}>
              <Pie key="chart2" data={outdata} {...chaerProps} />
            </div>
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
