import React, { useEffect, useState } from 'react';
import { Space, Spin, Cascader, Select } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { Column, Line } from '@/components/Charts';
import options from './options';
import SelectBlock from '../../../SearchBlock';

const { Option } = Select;

const ChannelDataContrast = (props) => {
  const { dispatch, loading, channelListOne, channelListTwo } = props;

  const [data, setData] = useState({
    groupType: 'day',
    startStatisticDay: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });
  const [channelTypeOne, setChannelTypeOne] = useState([]); // 暂存渠道一
  const [channelTypeTwo, setChannelTypeTwo] = useState([]); // 暂存渠道二
  const [selectType, setSelectType] = useState('totalRegisterNum'); // 暂存渠道二

  useEffect(() => {
    channelTypeOne.length !== 0 && fetchSearchOne();
  }, [data, channelTypeOne]);

  useEffect(() => {
    channelTypeTwo.length !== 0 && fetchSearchTwo();
  }, [data, channelTypeTwo]);

  // 请求接口
  const fetchSearchOne = () => {
    dispatch({
      type: 'userDataStat/fetchUserChannelContrastReportOne',
      payload: {
        ...data,
        utmSource: channelTypeOne[0],
        utmMedium: channelTypeOne[1],
      },
    });
  };
  const fetchSearchTwo = () => {
    dispatch({
      type: 'userDataStat/fetchUserChannelContrastReportTwo',
      payload: {
        ...data,
        utmSource: channelTypeTwo[0],
        utmMedium: channelTypeTwo[1],
      },
    });
  };

  const list = [...channelListOne, ...channelListTwo];

  return (
    <div>
      <Space style={{ width: '100%', marginBottom: 15 }}>
        <Cascader
          options={options}
          onChange={(val) => {
            setChannelTypeOne(val || []);
          }}
          placeholder="请选择统计层级"
          changeOnSelect={true}
          allowClear={false}
          expandTrigger="hover"
        />
        <div>对比</div>
        <Cascader
          options={options}
          onChange={(val) => {
            setChannelTypeTwo(val || []);
          }}
          placeholder="请选择统计层级"
          changeOnSelect={true}
          allowClear={false}
          expandTrigger="hover"
        />
      </Space>
      <SelectBlock
        data={data}
        setData={setData}
        allText={
          <Select value={selectType} style={{ width: 120 }} onChange={(val) => setSelectType(val)}>
            <Option value="totalRegisterNum">注册用户</Option>
            <Option value="totalPayNum">支付用户</Option>
          </Select>
        }
      ></SelectBlock>
      {/* 图表 */}
      <Spin spinning={!!loading}>
        {list.length === 0 && channelTypeOne.length === 0 && channelTypeTwo.length === 0 ? (
          <div
            style={{
              fontSize: 30,
              height: 510,
              textAlign: 'center',
              lineHeight: '510px',
              color: '#cccccc',
            }}
          >
            请选择渠道
          </div>
        ) : (
          <Line
            data={list}
            xyField={{ xField: 'statisticDay', yField: selectType }}
            legend={false}
            seriesField="type"
          />
        )}
      </Spin>
    </div>
  );
};

export default connect(({ userDataStat, loading }) => ({
  channelListOne: userDataStat.channelListOne,
  channelListTwo: userDataStat.channelListTwo,
  loading:
    loading.effects['userDataStat/fetchUserChannelContrastReportOne'] ||
    loading.effects['userDataStat/fetchUserChannelContrastReportTwo'],
}))(ChannelDataContrast);
