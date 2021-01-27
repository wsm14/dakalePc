import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Card, Row, Col, Spin } from 'antd';
import { Pie } from '@/components/Charts';
import QuestionTooltip from '@/components/QuestionTooltip';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment().subtract(1, 'day');

const BusinessTotalInfo = ({
  dispatch,
  loading,
  indata,
  merchantTotalBean,
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

  // 获取店铺统计数据
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
          ：{merchantTotalBean}
        </>
      }
    >
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
            <QuestionTooltip
              placement="bottom"
              title="商家累计收益"
              overlayStyle={{ maxWidth: 300 }}
              content={'默认统计到昨日，随时间搜索变化'}
            ></QuestionTooltip>
            ：{merchantTotalIncome}
            <div style={{ height: 250 }}>
              <Pie data={indata} {...chaerProps} />
            </div>
          </Col>
          <Col span={12}>
            <QuestionTooltip
              placement="bottom"
              title="商家累计消费"
              overlayStyle={{ maxWidth: 300 }}
              content={'默认统计到昨日，随时间搜索变化'}
            ></QuestionTooltip>
            ：{merchantTotalOut}
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
