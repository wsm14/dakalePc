import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';

function AssistanceModal(props) {
  const { infoList, visible, loading, params, onCancel } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '助力用户',
      type: 'user',
      name: 'helpUserId',
      span: 12,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '助力用户昵称',
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
      title: '助力时间',
      dataIndex: 'createTime',
    },
  ];

  return (
    <Modal
      title="助力详情"
      destroyOnClose
      footer={false}
      width={950}
      visible={visible}
      onCancel={onCancel}
    >
      <TableDataBlock
        order
        noCard={false}
        searchItems={searchItems}
        loading={loading}
        columns={getColumns}
        params={params}
        scrollY={500}
        rowKey={(record) => `${record.blindBoxHelpId}`}
        dispatchType="blindboxAssistance/fetchAssistanceDetail"
        pagination={false}
        {...infoList}
      ></TableDataBlock>
    </Modal>
  );
}

export default connect(({ blindboxAssistance, loading }) => ({
  infoList: blindboxAssistance.info,
  loading: loading.models.blindboxAssistance,
}))(AssistanceModal);
