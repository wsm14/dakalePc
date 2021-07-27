import React, { useRef, useState, useEffect } from 'react';
import { connect, Link } from 'umi';
import { Alert } from 'antd';
import { DAREN_TEMP_FLAG } from '@/common/constant';
import moment from 'moment';
import TableDataBlock from '@/components/TableDataBlock';
import SearchCard from './components/AchievementTotal/Search/SearchCard';
import { checkCityName } from '@/utils/utils';
import excelHeder from './components/AchievementTotal/excelHeder';

const ExpertUserAchievement = (props) => {
  const { list, kolLevel, loading, dispatch } = props;

  const [searchData, setSearchData] = useState({
    beginDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });

  const childRef = useRef();

  useEffect(() => {
    fetchGetKolLevel();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '哒人',
      name: 'userNameOrBeanCodeOrMobile',
      placeholder: '请输入昵称、豆号或手机号',
    },
    {
      label: '级别',
      name: 'level',
      type: 'select',
      select: kolLevel,
    },
    {
      label: '是否实习',
      name: 'tempFlag',
      type: 'select',
      select: DAREN_TEMP_FLAG,
    },
    {
      label: '注册地',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '哒人昵称/ID',
      dataIndex: 'username',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{val}</span>
          <span style={{ color: '#999' }}>{row.userIdString}</span>
        </div>
      ),
    },
    {
      title: '手机号/豆号',
      dataIndex: 'beanCode',
      render: (val, row) => `${row.mobile}\n${val}`,
    },
    {
      title: '级别',
      align: 'center',
      dataIndex: 'level',
      render: (val) => {
        let name = '';
        kolLevel?.forEach((item) => {
          if (item.value == val) {
            name = item.name;
          }
        });
        return <span>{name}</span>;
      },
    },
    {
      title: '是否实习',
      align: 'center',
      dataIndex: 'tempLevelFlag',
      render: (val) => DAREN_TEMP_FLAG[val],
    },
    {
      title: '注册地',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '新增家人数',
      align: 'center',
      dataIndex: 'familyCount',
    },
    {
      title: '新增直培哒人',
      align: 'center',
      dataIndex: 'familyDarenCount',
    },
    {
      title: '分销-核销笔数',
      align: 'center',
      dataIndex: 'statisticOrderCount',
    },
    {
      title: '分销-业绩流水',
      align: 'center',
      dataIndex: 'statisticTotalFee',
      render: (val, row) => `¥ ${val ? val : '0'}`,
    },
  ];

  useEffect(() => {
    childRef?.current?.fetchGetData(searchData);
  }, [searchData]);

  // 获取哒人等级数据
  const fetchGetKolLevel = () => {
    dispatch({
      type: 'baseData/fetchGetKolLevel',
    });
  };

  // 选择时间
  const handleSearchData = (time) => {
    setSearchData({
      beginDate: time[0].format('YYYY-MM-DD'),
      endDate: time[1].format('YYYY-MM-DD'),
    });
  };

  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'ordersList/fetchOrdersImport',
      data: { ...get() },
      exportProps: { header: excelHeder(kolLevel) },
    },
  ];

  return (
    <>
      <Alert message="当前数据统计到昨日" type="info" banner />
      <TableDataBlock
        order
        keepData
        cardProps={{
          title: <SearchCard setSearchData={handleSearchData}></SearchCard>,
        }}
        // btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={searchData}
        rowKey={(record) => `${record.beanCode}`}
        dispatchType="expertUserAchievementTotal/fetchGetList"
        {...list}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ expertUserAchievementTotal, baseData, loading }) => ({
  list: expertUserAchievementTotal.list,
  kolLevel: baseData.kolLevel,
  loading: loading.effects['expertUserAchievementTotal/fetchGetList'],
}))(ExpertUserAchievement);
