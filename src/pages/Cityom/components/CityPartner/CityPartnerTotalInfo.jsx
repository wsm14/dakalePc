import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin, Statistic } from 'antd';
import { Donut } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const CityPartnerTotalInfo = ({ dispatch, loading, totalData, btnExtra }) => {
  // 搜索参数
  const searchItems = [
    {
      label: '区域',
      type: 'rangePicker',
      name: 'mobile',
    },
  ];

  const data2 = [
    {
      type: '覆盖省市',
      value: totalData.all || 0,
    },
    {
      type: '覆盖区域',
      value: totalData.all || 0,
    },
  ];

  // 获取商户统计数据
  const fetchBusinessTotal = (userId) => {
    dispatch({
      type: 'businessList/fetchBusinessTotal',
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
            <Donut data={data2} totalLabel="全国" height={276} />
          </Spin>
        </Col>
        <Col span={12} style={{ borderLeft: '1px solid #ececec', paddingLeft: 50 }}>
          <Card bordered={false} bodyStyle={{ padding: 0 }} loading={loading}>
            <Row gutter={[16, 16]} span={12} align="middle" style={{ height: 276 }}>
              <Col span={8}>
                <Statistic title="合伙人总数" value={totalData.all}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="累计收益" value={totalData.all}></Statistic>
              </Col>
              <Col span={8}>
                <Statistic title="累计提现" value={totalData.all}></Statistic>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ cityPartner, loading }) => ({
  totalData: cityPartner.totalData,
  loading: loading.effects['cityPartner/fetchBusinessTotal'],
}))(CityPartnerTotalInfo);
