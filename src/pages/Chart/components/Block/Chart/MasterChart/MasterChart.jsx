import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Donut } from '@/components/Charts';
import { Typography, Row, Col } from 'antd';

const MasterChart = ({ dispatch, searchData, totalData }) => {
  // useEffect(() => {
  //   fetchGetTotalData(searchData);
  // }, [searchData]);

  // // 获取统计数据
  // const fetchGetTotalData = (payload = {}) => {
  //   dispatch({
  //     type: 'chartBlock/fetchChartBlockOrder',
  //     payload,
  //   });
  // };

  const data = [
    {
      type: '商户家主',
      value: 38,
    },
    {
      type: '用户家主',
      value: 52,
    },
  ];

  const heightChart = 330;

  return (
    <>
      <Typography.Title level={5}>圈层情况</Typography.Title>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Donut
            data={data}
            totalLabel="新增家主数"
            height={heightChart}
            legend={{ position: 'bottom', offsetY: 10 }}
            // angleField="count"
            // colorField="categoryName"
          />
        </Col>
        <Col span={12}>
          <Donut
            data={data}
            totalLabel="收益卡豆"
            height={heightChart}
            legend={{ position: 'bottom', offsetY: 10 }}
            // angleField="count"
            // colorField="categoryName"
          />
        </Col>
      </Row>
    </>
  );
};

export default connect(({ chartBlock }) => ({
  totalData: chartBlock.orderInfo,
}))(MasterChart);
