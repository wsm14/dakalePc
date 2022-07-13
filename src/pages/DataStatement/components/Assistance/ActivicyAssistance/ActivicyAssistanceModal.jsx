import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';

function ActivicyAssistanceModal(props) {
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
      title: '邀请用户',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '用户所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '被邀请时间',
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
}))(ActivicyAssistanceModal);
