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
      type: '新增入驻商户',
      value: totalData.all || 0,
    },
    {
      type: '家店商户数',
      value: totalData.all || 0,
    },
    {
      type: '家主商户数',
      value: totalData.all || 0,
    },
    {
      type: '活跃商户数',
      value: totalData.all || 0,
    },
    {
      type: '潜在流失商户数',
      value: totalData.all || 0,
    },
  ];

  const data2 = [
    {
      type: '餐饮',
      value: totalData.all || 0,
    },
    {
      type: '娱乐',
      value: totalData.all || 0,
    },
    {
      type: '医美',
      value: totalData.all || 0,
    },
    {
      type: '教育',
      value: totalData.all || 0,
    },
    {
      type: '装修',
      value: totalData.all || 0,
    },
    {
      type: '房产',
      value: totalData.all || 0,
    },
    {
      type: '宠物',
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
              <Donut data={data} totalLabel="总商户数" height={276} />
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={!!loading}>
              <Donut data={data2} height={276} />
            </Spin>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default connect(({ businessList, loading }) => ({
  totalData: businessList.totalData,
  loading: loading.effects['businessList/fetchBusinessTotal'],
}))(BusinessTotalInfo);
