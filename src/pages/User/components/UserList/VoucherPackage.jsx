import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { PLATFORM_TICKET_SCENE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

function VoucherPackage(props) {
  const { loading, visible, onClose, couponList } = props;
  const { show = false, detail = {} } = visible;

  // 搜索参数
  const searchItems = [
    {
      label: '券名称',
      name: 'helpUserId',
    },
    {
      label: '券类型',
      name: 'aatype',
      type: 'select',
      select: PLATFORM_TICKET_SCENE,
    },
    {
      label: '券状态',
      name: 'aastates',
      type: 'select',
      select: ['待使用', '已过期'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '券名称/ID',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '券类型',
      dataIndex: 'mobile',
    },
    {
      title: '券价值',
      dataIndex: 'mobile',
    },
    {
      title: '使用门槛',
      dataIndex: 'mobile',
    },
    {
      title: '券描述',
      dataIndex: 'mobile',
    },
    {
      title: '领取时间',
      dataIndex: 'mobile',
    },
    {
      title: '有效期',
      dataIndex: 'mobile',
    },
    {
      title: '券状态',
      dataIndex: 'mobile',
    },
    {
      title: '使用时间',
      dataIndex: 'mobile',
    },
  ];

  const modalProps = {
    title: '卡豆红包领取记录',
    visible: show,
    width: 1200,
    onCancel: onClose,
    footer: null,
  };
  return (
    <Modal {...modalProps}>
      <TableDataBlock
        order
        noCard={false}
        searchItems={searchItems}
        loading={loading}
        columns={getColumns}
        params={{ aa: 'aa' }}
        rowKey={(record) => `${record.blindBoxHelpId}`}
        dispatchType="userList/fetchCouponInfoGetList"
        {...couponList}
      ></TableDataBlock>
    </Modal>
  );
}

export default connect(({ loading, userList }) => ({
  couponList: userList.couponList,
  loading: loading.models.redEnvelopes,
}))(VoucherPackage);
