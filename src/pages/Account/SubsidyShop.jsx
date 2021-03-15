import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import moment from 'moment';
import { Card, Space, Button } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';
import SearchCard from './components/SubsidyShop/Search/SearchCard';
import tableColums from './components/SubsidyShop/List/tableColums';
import ExcelButton from '@/components/ExcelButton';

import SubsidyDetail from './components/SubsidyShop/Detail/SubsidyDetail';

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

const SubsidyShop = (props) => {
  const { subsidyShop, loading, dispatch, outBean, inBean } = props;
  const childRef = useRef();

  const [visible, setVisible] = useState(false);
  // 搜索默认参数
  const defaultValue = {
    latitude: 'order', // 统计纬度 order-按单显示 day-按日显示 month-按月显示
    time: [moment(), moment()],
    type: ['', 'platform'],
  };

  // platform-运营平台 partner-区县平台 province-省代平台
  const source = 'platform';

  // 搜索参数
  const [searchData, setSearchData] = useState(defaultValue);

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
    const { page, limit } = searchData;
    let pageObj = {};
    // 判断是否存在分页信息 存在则重置分页
    if (page) pageObj = { page, limit };
    childRef.current.fetchGetData({ ...newSearch, ...pageObj });
  }, [searchData]);

  // 获取详情 订单类型type 订单卡豆数bean
  const fetchGetDetail = (type, row) => {
    dispatch({
      type: 'subsidyShop/fetchSubsidyShopDetailById',
      payload: { subsidyId: row.subsidyId },
      callback: (info) => setVisible({ show: true, type, info }),
    });
  };

  return (
    <>
      <Card
        tabList={tabList}
        activeTabKey={searchData.latitude}
        style={{ marginBottom: 10 }}
        // title={
        //   <Space style={{ height: 80 }}>
        //     <QuestionTooltip
        //       placement="bottom"
        //       title="账户余额（卡豆）"
        //       overlayStyle={{ maxWidth: 300 }}
        //       content={'实时统计，不随时间搜索变化'}
        //     ></QuestionTooltip>
        //     ：{outBean}
        //   </Space>
        // }
        // extra={
        //   <>
        //     <span>补贴账户 | </span>
        //     <span>杭州联合银行 | </span>
        //     <span>67327823327838273238382</span>
        //   </>
        // }
        onTabChange={(key) => {
          const tabTime = {
            order: [moment(), moment()],
            day: [moment().startOf('month'), moment()],
            month: [moment().startOf('year'), moment()],
          }[key];
          // 切换tab 重置时间选项
          setSearchData({ ...searchData, latitude: key, time: tabTime, page: 1, limit: 10 });
        }}
      >
        <SearchCard
          tabkey={searchData.latitude}
          searchData={searchData}
          setSearchData={setSearchData}
        ></SearchCard>
      </Card>
      <Card
        title={
          <Space size="large" style={{ color: '#f00' }}>
            <span> 收入：{inBean}</span>
            <span>支出：{outBean}</span>
          </Space>
        }
        extra={
           <ExcelButton
              dispatchType={'subsidyShop/fetchSubsidyShopList'}
              dispatchData={newSearch}
              exportProps={{
                header: tableColums({
                  type: searchData.latitude,
                  searchData,
                  setSearchData,
                  fetchGetDetail,
                }).slice(0, -1),
              }}
            ></ExcelButton>
        }
      >
        <TableDataBlock
          order
          firstFetch={false}
          noCard={false}
          cRef={childRef}
          loading={loading}
          columns={tableColums({
            type: searchData.latitude,
            searchData,
            setSearchData,
            fetchGetDetail,
          })}
          params={newSearch}
          rowKey={(record) => `${record.identification || record.time}`}
          dispatchType="subsidyShop/fetchSubsidyShopList"
          {...subsidyShop.list}
        ></TableDataBlock>
        <SubsidyDetail visible={visible} onClose={() => setVisible(false)}></SubsidyDetail>
      </Card>
    </>
  );
};

export default connect(({ subsidyShop, loading }) => ({
  subsidyShop,
  outBean: subsidyShop.outBean,
  inBean: subsidyShop.inBean,
  loading: loading.effects['subsidyShop/fetchSubsidyShopList'],
}))(SubsidyShop);
