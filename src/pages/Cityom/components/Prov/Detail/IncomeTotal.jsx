import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Spin } from 'antd';
import { Bar } from '@/components/Charts';
import SearchCondition from '@/components/SearchCondition';

const ProvCompanyTotalInfo = ({ dispatch, loading, companyId, totalData }) => {
  const [selectYear, setSelectYear] = useState(moment().format('YYYY'));

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
  const fetchIncomeDetail = (values = {}) => {
    dispatch({
      type: 'provCompany/fetchProvBeanDetail',
      payload: { companyId, year: values.year || moment().format('YYYY') },
      callback: (year) => setSelectYear(year),
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
          年份：{selectYear}年&nbsp;&nbsp;&nbsp;&nbsp;收益：{totalData.total}卡豆
        </div>
        <Bar
          data={totalData.list}
          height={350}
          meta={{ month: { alias: '月份' }, beanSum: { alias: '卡豆数（个）' } }}
          xyField={{ xField: 'month', yField: 'beanSum' }}
        />
      </Spin>
    </>
  );
};

export default connect(({ provCompany, loading }) => ({
  totalData: provCompany.totalData,
  loading: loading.effects['provCompany/fetchProvBeanDetail'],
}))(ProvCompanyTotalInfo);
