import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Card, Alert } from 'antd';
import { ExcelButton } from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import SearchCard from './components/SubsidyShop/Search/SearchCard';
import tableColums from './components/SubsidyShop/List/tableColums';
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
    type: ['platform', 'directCharge', 'platformSubsidy',"pushVideo"],
  };

  // 搜索参数
  const [searchData, setSearchData] = useState(defaultValue);

  // 搜索参数格式化
  const newSearch = {
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

  // 获取详情
  const fetchGetDetail = (type, row) => {
    const apiProps = {
      merchant: {
        key: 'subsidyId',
        value: 'identification',
        api: 'subsidyShop/fetchSubsidyShopDetailById',
      },
      user: { key: 'identification', value: 'id', api: 'subsidyShop/fetchSubsidyUserDetailById' },
    }[type];
    dispatch({
      type: apiProps.api,
      payload: {
        [apiProps.key]: row[apiProps.value],
      },
      callback: (info) => setVisible({ show: true, type, info, titles: row.taskName }),
    });
  };

  return (
    <>
      <Card
        tabList={tabList}
        activeTabKey={searchData.latitude}
        style={{ marginBottom: 5 }}
        onTabChange={(key) => {
          const tabTime = {
            order: [moment(), moment()],
            day: [moment().startOf('month'), moment()],
            month: [moment().startOf('year'), moment()],
          }[key];
          // 切换tab 重置时间选项
          setSearchData({ ...searchData, latitude: key, time: tabTime, page: 1, limit: 10 });
        }}
        tabBarExtraContent={
          <ExcelButton
            dispatchType={'subsidyShop/fetchSubsidyShopList'}
            dispatchData={newSearch}
            exportProps={{
              header: tableColums({
                type: searchData.latitude,
                searchData,
                setSearchData,
                fetchGetDetail,
              }),
            }}
          ></ExcelButton>
        }
      >
        <SearchCard
          tabkey={searchData.latitude}
          searchData={searchData}
          setSearchData={setSearchData}
        ></SearchCard>
      </Card>
      <Alert
        message={
          <div style={{ color: '#f00' }}>
            <span> 收入（卡豆）：{inBean}</span>
            <span style={{ marginLeft: '50px' }}>支出（卡豆）：{outBean}</span>
          </div>
        }
        type="info"
        banner
      />
      <Card>
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
          rowKey={(row) =>
            `${
              (row.identification && row.id + row.identification + row.gainTime) ||
              row.gainMonth ||
              row.gainTime
            }`
          }
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
  loading: loading.models.subsidyShop,
}))(SubsidyShop);
