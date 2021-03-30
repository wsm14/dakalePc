import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const TaskDetailList = (props) => {
  const { detailList, loading, visible = {}, onClose } = props;

  const { show = false, detail = {} } = visible;
  const { subsidyId, taskName, subsidizedBeans } = detail;

  // 搜索参数
  const searchItems = [
    {
      label: '店铺名称',
      name: 'taskName',
    },
  ];

  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'image',
    },
    {
      title: '店铺帐号',
      dataIndex: 'topicName',
    },
    {
      title: '所属商圈',
      dataIndex: 'topicDesc',
    },
    {
      title: '所属行业',
      align: 'center',
      dataIndex: 'recommendFlag',
      render: (val) => (val == '1' ? '推荐' : '不推荐'),
    },
    {
      title: '地址',
      dataIndex: 'topicDesc',
    },
    {
      title: '补贴卡豆数',
      align: 'right',
      dataIndex: 'topicDesc',
    },
    {
      title: '已消耗卡豆数',
      align: 'right',
      dataIndex: 'topicDesc',
    },
  ];

  return (
    <Modal
      title={`补贴详情 - ${taskName} | 总补贴卡豆：${subsidizedBeans}`}
      width={1150}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <TableDataBlock
        order
        noCard={false}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(row) => `${row.topicIdString}`}
        params={{ subsidyId }}
        dispatchType="subsidyManage/fetchSubsidyTaskDetailList"
        size="middle"
        {...detailList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ subsidyManage, loading }) => ({
  detailList: subsidyManage.detailList,
  loading: loading.effects['subsidyManage/fetchSubsidyTaskDetailList'],
}))(TaskDetailList);
