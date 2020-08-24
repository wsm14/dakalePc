import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Bar } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const CityPartnerIncomeTotal = ({ dispatch, loading, inconmeTotalData, btnExtra }) => {
  // 搜索参数
  const searchItems = [
    {
      label: '年份',
      type: 'datePicker',
      name: 'mobile',
      picker: 'year',
    },
  ];

  const data = [
    {
      type: '1月',
      value: 38,
    },
    {
      type: '2月',
      value: 52,
    },
    {
      type: '3月',
      value: 61,
    },
    {
      type: '4月',
      value: 145,
    },
    {
      type: '5月',
      value: 48,
    },
    {
      type: '6月',
      value: 12,
    },
    {
      type: '7月',
      value: 32,
    },
    {
      type: '8月',
      value: 38,
    },
    {
      type: '9月',
      value: 381,
    },
    {
      type: '10月',
      value: 382,
    },
    {
      type: '11月',
      value: 333,
    },
    {
      type: '12月',
      value: 31,
    },
  ];

  // 获取统计数据
  const fetchIncomeDetail = (userId) => {
    dispatch({
      type: 'cityPartner/fetchIncomeDetail',
      payload: { userId },
    });
  };

  useEffect(() => {
    // fetchIncomeDetail()
  }, []);

  return (
    <>
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchIncomeDetail}
        btnExtra={btnExtra}
      ></SearchCondition>
      <Spin spinning={!!loading}>
        <div style={{ textAlign: 'center' }}>年份：2020年&nbsp;&nbsp;&nbsp;&nbsp;收益：124561卡豆</div>
        <Bar
          data={data}
          height={350}
          meta={{ type: { alias: '月份' }, value: { alias: '卡豆数（个）' } }}
        />
      </Spin>
    </>
  );
};

export default connect(({ cityPartner, loading }) => ({
  inconmeTotalData: cityPartner.inconmeTotalData,
  loading: loading.effects['cityPartner/fetchIncomeDetail'],
}))(CityPartnerIncomeTotal);
