import React, { useState } from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import BlindboxAssistanceModal from './BlindboxAssistanceModal';

function BlindboxAssistance(props) {
  const { list, loading } = props;

  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '发起用户',
      type: 'user',
      name: 'userId',
    },
    {
      label: '助力日期',
      type: 'rangePicker',
      name: 'helpStartTime',
      end: 'helpEndTime',
    },
    {
      label: '用户所属地区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      placeholder: '请选择',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '助力日期',
      dataIndex: 'helpDate',
    },
    {
      title: '发起用户昵称',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '用户手机号',
      dataIndex: 'mobile',
    },
    {
      title: '用户豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '用户所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '当日好友助力次数',
      align: 'right',
      dataIndex: 'helpTimes',
    },
    {
      type: 'handle',
      dataIndex: 'userId',
      render: (val, row) => [
        {
          type: 'assistanceInfo',
          click: () => setVisible({ show: true, data: row }),
        },
      ],
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}${record.helpDate}`}
        dispatchType="blindboxAssistance/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 助力详情 */}
      <BlindboxAssistanceModal
        visible={visible}
        onClose={() => setVisible(false)}
      ></BlindboxAssistanceModal>
    </>
  );
}

export default connect(({ blindboxAssistance, loading }) => ({
  list: blindboxAssistance.list,
  loading: loading.effects['blindboxAssistance/fetchGetList'],
}))(BlindboxAssistance);
