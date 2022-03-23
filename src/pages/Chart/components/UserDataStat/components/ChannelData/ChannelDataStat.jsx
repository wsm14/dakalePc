import React, { useEffect, useState } from 'react';
import { Radio, Space, Select, DatePicker, Checkbox } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import TableDataBlock from '@/components/TableDataBlock';

const disTime = moment('2020-03-01');

const ChannelDataStat = (props) => {
  const { loading, channelList } = props;

  const [selectedTime, setSelectedTime] = useState([
    moment().subtract(7, 'day'),
    moment().subtract(1, 'day'),
  ]); // 暂存时间

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day').subtract(1, 'day')) || current < disTime;

  const getColumns = [
    {
      title: '文件名',
      align: 'center',
      dataIndex: 'fileName',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
    },
  ];

  console.log(moment().subtract(1, 'day').format('YYYY-MM-DD'));

  return (
    <div>
      <Space style={{ width: '100%' }}>
        <DatePicker.RangePicker
          allowClear={false}
          value={selectedTime}
          onChange={(val) => {
            setSelectedTime(val);
          }}
          disabledDate={disabledDate}
          style={{ width: 256 }}
        />
      </Space>
      <TableDataBlock
        noCard={false}
        loading={loading}
        columns={getColumns}
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
