import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Card, Row, Col, Spin } from 'antd';
import { Pie } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment().subtract(1, 'day');

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

  const chaerProps = {
    title: '累计卡豆',
    innerRadius: 0.6,
    angleField: 'content',
    colorField: 'statisticDesc',
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchBusinessTotal}
        btnExtra={btnExtra}
        initialValues={{
          beginDate: [dDate, dDate],
        }}
      ></SearchCondition>
      <Spin spinning={!!loading}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            商家累计收益：{merchantTotalIncome}
            <div style={{ height: 250 }}>
              <Pie data={indata} {...chaerProps} />
            </div>
          </Col>
          <Col span={12}>
            商家累计消费：{merchantTotalOut}
            <div style={{ height: 250 }}>
              <Pie data={outdata} {...chaerProps} />
            </div>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default connect(({ accountBusiness, loading }) => ({
  ...accountBusiness,
  loading: loading.effects['accountBusiness/fetchBusinessTotal'],
}))(BusinessTotalInfo);
