import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Bar } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const CityPartnerIncomeTotal = ({ dispatch, loading, inconmeTotalData, record }) => {
  const [year, setYear] = useState(moment().format('YYYY'));

  // 搜索参数
  const searchItems = [
    {
      label: '年份',
      type: 'datePicker',
      name: 'year',
      picker: 'year',
    },
  ];

  // 获取统计数据
  const fetchIncomeDetail = (value) => {
    if (value) setYear(value.year);
    dispatch({
      type: 'cityPartner/fetchCityIncomeDetail',
      payload: { partnerId: record.partnerIdString, year: moment().format('YYYY'), ...value },
    });
  };

  useEffect(() => {
    fetchIncomeDetail();
  }, []);

  return (
    <>
      <SearchCondition searchItems={searchItems} handleSearch={fetchIncomeDetail}></SearchCondition>
      <Spin spinning={!!loading}>
        <div style={{ textAlign: 'center' }}>
          年份：{year}年&nbsp;&nbsp;&nbsp;&nbsp;收益：{inconmeTotalData.totalBean}卡豆
        </div>
        <Bar
          data={inconmeTotalData.recordList}
          height={350}
          meta={{ month: { alias: '月份' }, beanSum: { alias: '卡豆数（个）' } }}
          xyField={{ xField: 'month', yField: 'beanSum' }}
        />
      </Spin>
    </>
  );
};

export default connect(({ cityPartner, loading }) => ({
  inconmeTotalData: cityPartner.inconmeTotalData,
  loading: loading.effects['cityPartner/fetchCityIncomeDetail'],
}))(CityPartnerIncomeTotal);
