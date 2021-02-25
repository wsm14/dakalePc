import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { DatePicker, Select, Spin, Space, Empty } from 'antd';

const disTime = moment('2020-03-01');

const SearchCard = ({ fetchGetTotalData, dispatch, mreSelect, loading }) => {
  const [selectedTime, setSelectedTime] = useState([moment(), moment()]);
  const [merchantId, setMerchantId] = useState('');

  useEffect(() => {
    fetchGetTotalData({
      beginDate: selectedTime[0].format('YYYY-MM-DD'),
      endDate: selectedTime[1].format('YYYY-MM-DD'),
      merchantId,
    });
  }, [merchantId, selectedTime]);

  // 禁止选择时间
  const disabledDate = (current) =>
    (current && current > moment().endOf('day')) || current < disTime;

  // 搜索店铺
  const fetchClassifyGetMre = debounce((keyword) => {
    if (!keyword) return;
    dispatch({
      type: 'goodsManage/fetchClassifyGetMre',
      payload: {
        limit: 999,
        page: 1,
        keyword,
      },
    });
  }, 500);

  return (
    <Space>
      <DatePicker.RangePicker
        allowClear={false}
        value={selectedTime}
        onChange={(val) => setSelectedTime(val)}
        disabledDate={disabledDate}
        style={{
          width: 256,
        }}
      />
      <Select
        showSearch
        dropdownMatchSelectWidth={false}
        placeholder="输入搜索商家"
        notFoundContent={
          loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
        }
        allowClear
        onSearch={fetchClassifyGetMre}
        onChange={(val) => setMerchantId(val)}
        optionFilterProp="children"
        style={{ width: 256 }}
      >
        {mreSelect.map((d) => (
          <Select.Option key={d.value} value={d.value}>
            {d.name}
            {d.otherData && <div style={{ fontSize: 12, color: '#989898' }}>{d.otherData}</div>}
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
};

export default connect(({ goodsManage, loading }) => ({
  mreSelect: goodsManage.mreSelect,
  loading: loading.models.goodsManage,
}))(SearchCard);
