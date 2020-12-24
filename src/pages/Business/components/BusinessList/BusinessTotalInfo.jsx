import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Card, Row, Col, Spin } from 'antd';
import { Pie, Column } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const dDate = moment().subtract(1, 'day');

const BusinessTotalInfo = ({ dispatch, loading, totalData, btnExtra }) => {
  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
      disabledDate: (current) => current && current > moment().endOf('day').subtract(1, 'day'),
    },
  ];

  const { chartsLeft, chartsRight } = totalData;

  const data = [
    {
      type: '总商家',
      value: Number(chartsLeft.totalMerchant) || 0,
    },
    {
      type: '活跃商家',
      value: Number(chartsLeft.activeMerchant) || 0,
    },
    {
      type: '静默商家',
      value: Number(chartsLeft.inactiveMerchant) || 0,
    },
    {
      type: '新入驻商家',
      value: Number(chartsLeft.merchantSettle) || 0,
    },
    {
      type: '新增家主',
      value: Number(chartsLeft.parentMerchant) || 0,
    },
    {
      type: '新增家店',
      value: Number(chartsLeft.childMerchant) || 0,
    },
  ];

  // 获取商户统计数据
  const fetchBusinessTotal = (
    values = {
      beginDate: dDate.format('YYYY-MM-DD'),
      endDate: dDate.format('YYYY-MM-DD'),
    },
  ) => {
    dispatch({
      type: 'businessList/fetchBusinessTotal',
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
        initialValues={{
          beginDate: [dDate, dDate],
        }}
      ></SearchCondition>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Spin spinning={!!loading}>
            <Column
              data={data}
              height={300}
              meta={{ type: { alias: '分类' }, value: { alias: '数量' } }}
            />
          </Spin>
        </Col>
        <Col span={12}>
          <Spin spinning={!!loading}>
            <Pie data={chartsRight} height={300} angleField="count" colorField="categoryName" />
          </Spin>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ businessList, loading }) => ({
  totalData: businessList.totalData,
  loading: loading.effects['businessList/fetchBusinessTotal'],
}))(BusinessTotalInfo);
