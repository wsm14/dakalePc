import React, { useEffect, useState, useRef } from 'react';
import { Space, DatePicker, Cascader } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { CHANNEL_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import options from './options';

const disTime = moment('2020-03-01');

const ChannelDataStat = (props) => {
  const { loading, channelList } = props;
  const childRef = useRef();

  const [selectedTime, setSelectedTime] = useState([
    moment().subtract(1, 'day'),
    moment().subtract(1, 'day'),
  ]); // 暂存时间
  const [searchType, setSearchType] = useState([]); // 暂存类型

  useEffect(() => {
    handleSearchList();
  }, [selectedTime, searchType]);

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day').subtract(1, 'day')) || current < disTime;

  // 搜索列表
  const handleSearchList = (data) => {
    childRef.current.fetchGetData({
      startStatisticDay: selectedTime[0].format('YYYY-MM-DD'),
      endStatisticDay: selectedTime[1].format('YYYY-MM-DD'),
      utmSource: searchType[0],
      utmMedium: searchType[1],
      ...data,
    });
  };

  // 排序
  const handleSort = (type, sortType) => {
    console.log(type, sortType, 'c');
    if (sortType === 'ascend') {
      handleSearchList({
        orderBy: {
          totalRegisterNum: 'registerAsc',
          totalPayNum: 'payAsc',
        }[type],
      });
    } else if (sortType === 'descend') {
      handleSearchList({
        orderBy: {
          totalRegisterNum: 'registerDesc',
          totalPayNum: 'payDesc',
        }[type],
      });
    } else {
      handleSearchList({
        orderBy: 'registerDesc',
      });
    }
  };
  const obj = {
    totalRegisterNum: {
      ascend: 'registerAsc',
      descend: 'registerDesc',
    },
    totalPayNum: {
      ascend: 'payAsc',
      descend: 'payDesc',
    },
  };

  const getColumns = [
    {
      title: '媒介',
      align: 'center',
      dataIndex: 'utmMedium',
      render: (val, row) =>
        `${
          ['applicationMarket'].includes(row.utmSource)
            ? CHANNEL_TYPE[row.utmSource]
            : row.utmSource
        }-${val}`,
    },
    {
      title: '注册用户',
      align: 'center',
      dataIndex: 'totalRegisterNum',
      sorter: true,
    },
    {
      title: '支付用户',
      align: 'center',
      dataIndex: 'totalPayNum',
      sorter: true,
    },
  ];

  return (
    <div>
      <Space style={{ width: '100%', margin: '15px 0' }}>
        <DatePicker.RangePicker
          allowClear={false}
          value={selectedTime}
          onChange={(val) => {
            setSelectedTime(val);
          }}
          disabledDate={disabledDate}
          style={{ width: 256 }}
        />
        <Cascader
          options={options}
          onChange={(val) => {
            setSearchType(val || []);
          }}
          placeholder="请选择统计层级"
          changeOnSelect={true}
          expandTrigger="hover"
        />
      </Space>
      <TableDataBlock
        order={true}
        noCard={false}
        loading={loading}
        columns={getColumns}
        cRef={childRef}
        rowKey={(row) => `${row.utmSource}${row.utmMedium}`}
        params={{
          startStatisticDay: selectedTime[0].format('YYYY-MM-DD'),
          endStatisticDay: selectedTime[1].format('YYYY-MM-DD'),
          orderBy: 'registerDesc',
        }}
        sortConfig={{
          sortConstant: obj,
          sortKey: 'orderBy',
          defaultValue: 'registerDesc',
        }}
        dispatchType="userDataStat/fetchUserChannelStatisticsReport"
        {...channelList}
      />
    </div>
  );
};

export default connect(({ userDataStat, loading }) => ({
  channelList: userDataStat.channelList,
  loading: loading.effects['userDataStat/fetchUserChannelStatisticsReport'],
}))(ChannelDataStat);
