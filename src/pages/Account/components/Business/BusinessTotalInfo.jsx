import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const BusinessTotalInfo = ({ dispatch, loading, totalData, btnExtra }) => {
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
      type: '累计充值',
      value: totalData.all || 0,
    },
    {
      type: '预约预订',
      value: totalData.all || 0,
    },
    {
      type: '卡豆抵扣',
      value: totalData.all || 0,
    },
    {
      type: '圈层分佣',
      value: totalData.all || 0,
    },
  ];

  const data2 = [
    {
      type: '累计提现',
      value: totalData.all || 0,
    },
    {
      type: '发布视频',
      value: totalData.all || 0,
    },
    {
      type: '发布图文',
      value: totalData.all || 0,
    },
  ];

  // 获取商户统计数据
  const fetchBusinessTotal = (userId) => {
    dispatch({
      type: 'accountBusiness/fetchBusinessTotal',
      payload: { userId },
    });
  };

  useEffect(() => {
    // fetchBusinessTotal()
  }, []);

  return (
    <>
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
    </>
  );
};

export default connect(({ accountBusiness, loading }) => ({
  totalData: accountBusiness.totalData,
  loading: loading.effects['accountBusiness/fetchBusinessTotal'],
}))(BusinessTotalInfo);
