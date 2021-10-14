import React from 'react';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';

function AssistanceModal(props) {
  const { infoList, loading, info, ...rest } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '助力用户',
      type: 'user',
      name: 'helpUserId',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '助力用户昵称',
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
      title: '助力时间',
      fixed: 'left',
      dataIndex: 'createTime',
    },
  ];

  return (
    <Modal title="助力详情" destroyOnClose footer={false} {...rest}>
      <TableDataBlock
        order
        noCard={false}
        searchItems={searchItems}
        loading={loading}
        columns={getColumns}
        params={info}
        rowKey={(record) => `${record.helpUserId}`}
        dispatchType="assistanceList/fetchAssistanceDetail"
        {...infoList}
      ></TableDataBlock>
    </Modal>
  );
}

export default AssistanceModal;
