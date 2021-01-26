import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import moment from 'moment';
import ExcelButton from '@/components/ExcelButton';
import DataTableBlock from '@/components/DataTableBlock';
import IncomeTotal from './components/Income/Total';
import SearchCard from './components/Income/Search/SearchCard';
import tableColums from './components/Income/List/tableColums';
import IncomeOrderDetail from './components/Income/Detail/IncomeOrderDetail';

const tabList = [
  {
    key: 'order',
    tab: '按单显示',
  },
  {
    key: 'day',
    tab: '按日显示',
  },
  {
    key: 'month',
    tab: '按月显示',
  },
];

// 搜索默认参数
const defaultValue = {
  latitude: 'order', // 统计纬度 order-按单显示 day-按日显示 month-按月显示
  time: [moment(), moment()],
  type: ['scan', 'goods', 'coupon', 'moment'],
};

// platform-运营平台 partner-区县平台 province-省代平台
const source = 'platform';

const PlatformIncome = ({ platformIncome, loadingList, dispatch }) => {
  // 表格ref
  const childRef = useRef();

  // 搜索参数
  const [searchData, setSearchData] = useState(defaultValue);
  // 查看详情
  const [visible, setVisible] = useState(false);

  // 搜索参数格式化
  const newSearch = {
    source,
    latitude: searchData.latitude,
    type: searchData.type.toString(),
    beginTime: searchData.time[0].format('YYYY-MM-DD'),
    endTime: searchData.time[1].format('YYYY-MM-DD'),
  };

  // 搜索参数改变时请求
  useEffect(() => {
    childRef.current.fetchGetData(newSearch);
  }, [searchData]);

  // 获取详情
  const fetchGetDetail = (identification, type) => {
    dispatch({
      type: 'platformIncome/fetchPlatformInconmeDetail',
      payload: { identification, source },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  return (
    <>
      <Card
        tabList={tabList}
        activeTabKey={searchData.latitude}
        tabBarExtraContent={
          // 导出excel
          <ExcelButton
            dispatchType={'platformIncome/fetchPlatformInconme'}
            dispatchData={newSearch}
            exportProps={{ header: tableColums({ type: searchData.latitude }).slice(0, -1) }}
          ></ExcelButton>
        }
        onTabChange={(key) => {
          const tabTime = {
            order: [moment(), moment()],
            day: [moment().startOf('month'), moment()],
            month: [moment().startOf('year'), moment()],
          }[key];
          // 切换tab 重置时间选项
          setSearchData({ ...searchData, latitude: key, time: tabTime });
        }}
      >
        {/* 搜索区域 */}
        <SearchCard
          tabkey={searchData.latitude}
          searchData={searchData}
          setSearchData={setSearchData}
        ></SearchCard>
        {/* 统计区域 */}
        <IncomeTotal></IncomeTotal>
        {/* 表格 */}
        <DataTableBlock
          NoSearch
          noCard={false}
          cRef={childRef}
          loading={loadingList}
          columns={tableColums({
            type: searchData.latitude,
            searchData,
            setSearchData,
            fetchGetDetail,
          })}
          params={newSearch}
          rowKey={(record) => `${record.identification || record.time}`}
          dispatchType="platformIncome/fetchPlatformInconme"
          {...platformIncome.list}
        ></DataTableBlock>
      </Card>
      <IncomeOrderDetail visible={visible} onClose={() => setVisible(false)}></IncomeOrderDetail>
    </>
  );
};

export default connect(({ platformIncome, loading }) => ({
  platformIncome,
  loadingList:
    loading.effects['platformIncome/fetchPlatformInconme'] ||
    loading.effects['platformIncome/fetchPlatformInconmeDetail'],
}))(PlatformIncome);
