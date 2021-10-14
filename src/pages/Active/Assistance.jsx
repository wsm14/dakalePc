import React, { useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import { checkCityName } from '@/utils/utils';
import AssistanceModal from './components/AssistanceModal/AssistanceModal';
import { Button } from 'antd';

function Assistance(props) {
  const { list, loading, infoList, dispatch } = props;
  console.log(list, 'list');

  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState(null);
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
      fixed: 'left',
      dataIndex: 'helpDate',
    },
    {
      title: '发起用户昵称',
      fixed: 'left',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '用户手机号',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '用户豆号',
      fixed: 'left',
      dataIndex: 'beanCode',
    },
    {
      title: '用户所属地区',
      fixed: 'left',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '当日好友助力次数',
      fixed: 'left',
      dataIndex: 'helpTimes',
    },
    {
      type: 'handle',
      dataIndex: 'userId',
      render: (val, row) => [
        {
          type: 'assistanceInfo',
          click: () => AssistanceInfo({ userId: val, helpDate: row.helpDate }),
        },
      ],
    },
  ];

  // 获取详情
  const AssistanceInfo = (payload) => {
    setVisible(true);
    setInfo(payload);
  };

  const handleOk = () => {
    setVisible(false);
  };

  return (
    <>
      <TableDataBlock
        order
        searchItems={searchItems}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.userId}`}
        dispatchType="assistanceList/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 助力详情 */}
      <AssistanceModal
        visible={visible}
        width={1300}
        infoList={infoList}
        info={info}
        onCancel={() => setVisible(false)}
      ></AssistanceModal>
    </>
  );
}

export default connect(({ assistanceList, loading }) => ({
  list: assistanceList.list,
  infoList: assistanceList.info,
  loading: loading.models.assistanceList,
}))(Assistance);
