import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const BusinessTotalInfo = ({
  dispatch,
  loading,
  indata,
  merchantTotalOut,
  merchantTotalIncome,
  outdata,
  btnExtra,
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

  // 获取商户统计数据
  const fetchBusinessTotal = (values) => {
    dispatch({
      type: 'accountBusiness/fetchBusinessTotal',
      payload: values,
    });
  };

  useEffect(() => {
    fetchBusinessTotal();
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
          商家累计收益：{merchantTotalIncome}
          <Spin spinning={!!loading}>
            <Donut
              data={indata}
              totalLabel="合计卡豆"
              height={276}
              angleField="content"
              colorField="statisticDesc"
            />
          </Spin>
        </Col>
        <Col span={12}>
          <Spin spinning={!!loading}>
            商家累计消费：{merchantTotalOut}
            <Donut
              data={outdata}
              totalLabel="合计卡豆"
              height={276}
              angleField="content"
              colorField="statisticDesc"
            />
          </Spin>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ accountBusiness, loading }) => ({
  ...accountBusiness,
  loading: loading.effects['accountBusiness/fetchBusinessTotal'],
}))(BusinessTotalInfo);
