import React, { useEffect, useState, useRef } from 'react';
import { Radio, Space, Select, DatePicker, Checkbox } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import TableDataBlock from '@/components/TableDataBlock';

const disTime = moment('2020-03-01');

const ChannelDataStat = (props) => {
  const { loading, channelList } = props;
  const childRef = useRef();

  const [selectedTime, setSelectedTime] = useState([
    moment().subtract(1, 'day'),
    moment().subtract(1, 'day'),
  ]); // 暂存时间

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day').subtract(1, 'day')) || current < disTime;

  const getColumns = [
    {
      title: '媒介',
      align: 'center',
      dataIndex: 'utmSource',
    },
    {
      title: '注册用户',
      align: 'center',
      dataIndex: 'totalRegisterNum',
    },
    {
      title: '支付用户',
      align: 'center',
      dataIndex: 'totalPayNum',
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
            childRef.current.fetchGetData({
              startStatisticDay: val[0].format('YYYY-MM-DD'),
              endStatisticDay: val[1].format('YYYY-MM-DD'),
            });
          }}
          disabledDate={disabledDate}
          style={{ width: 256 }}
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
