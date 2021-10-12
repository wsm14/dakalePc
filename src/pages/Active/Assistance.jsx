import React, { useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import { checkCityName } from '@/utils/utils';
import AssistanceModal from './components/AssistanceModal/AssistanceModal';

function Assistance(props) {
  const { list, loading, dispatch } = props;

  const [visible, setVisible] = useState(false);
  // 搜索参数
  const searchItems = [
    {
      label: '发起用户',
      name: 'activityName',
      placeholder: '请输入用户昵称、手机号或豆号',
    },
    {
      label: '助力日期',
      type: 'rangePicker',
      name: 'helpStartTime',
      end: 'helpEndTime',
      placeholder: '开始日期  -  结束日期',
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
      dataIndex: 'activityTemplateId',
      render: (val, row) => [
        {
          type: 'assistanceInfo',
          click: () => fetchAssistanceDetail({ userId: val }),
        },
      ],
    },
  ];

  // 获取详情
  const fetchAssistanceDetail = (payload, type) => {
    setVisible(true);
    // dispatch({
    //   type: 'assistanceList/fetchAssistanceDetail',
    //   payload,
    //   // callback: (info) => setVisible({ show: true, info }),
    // });
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
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
        dispatchType="assistanceList/fetchGetAssistanceList"
        {...list}
      ></TableDataBlock>
      {/* 助力详情 */}
      <AssistanceModal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      ></AssistanceModal>
    </>
  );
}

export default connect(({ assistanceList, loading }) => ({
  list: assistanceList.list,
  loading: loading.models.assistanceList,
}))(Assistance);
