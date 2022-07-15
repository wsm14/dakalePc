import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { PLATFORM_TICKET_SCENE, USER_COUPON_STATES } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

function VoucherPackage(props) {
  const { loading, visible, onClose, couponList } = props;
  const { show = false, userId } = visible;

  // 搜索参数
  const searchItems = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '券类型',
      name: 'useScenesType',
      type: 'select',
      select: PLATFORM_TICKET_SCENE,
    },
    {
      label: '券状态',
      name: 'couponStatus',
      type: 'select',
      select: USER_COUPON_STATES,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '券名称/ID',
      dataIndex: 'couponName',
      render: (val, row) => (
        <>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div>{row?.platformCouponId}</div>
        </>
      ),
    },
    {
      title: '券类型',
      dataIndex: 'useScenesType',
      render: (val) => PLATFORM_TICKET_SCENE[val],
    },
    {
      title: '券价值',
      align: 'right',
      dataIndex: 'couponValue',
      render: (val) => `￥${val}`,
    },
    {
      title: '使用门槛',
      width: 120,
      align: 'right',
      dataIndex: 'thresholdPrice',
      render: (val) => `￥${val}`,
    },
    {
      title: '券描述',
      dataIndex: 'couponDesc',
    },
    {
      title: '领取时间',
      dataIndex: 'createTime',
    },
    {
      title: '有效期',
      align: 'right',
      dataIndex: 'activeBeginDate',
      render: (val, row) => `${val}\n~${row.activeEndDate}`,
    },
    {
      title: '券状态',
      dataIndex: 'couponStatus',
      render: (val) => USER_COUPON_STATES[val],
    },
    {
      title: '使用时间',
      dataIndex: 'verificationTime',
    },
  ];

  const modalProps = {
    title: '卡豆红包领取记录',
    visible: show,
    width: 1200,
    destroyOnClose: true,
    onCancel: onClose,
    footer: null,
  };
  return (
    <Modal {...modalProps}>
      <TableDataBlock
        order
        noCard={false}
        scrollY={500}
        searchItems={searchItems}
        loading={loading}
        columns={getColumns}
        params={{ userId }}
        rowKey={(record) => `${record.userPlatformCouponId}`}
        dispatchType="userList/fetchPageListUserPlatformCouponAdmin"
        {...couponList}
      ></TableDataBlock>
    </Modal>
  );
}

export default connect(({ loading, userList }) => ({
  couponList: userList.couponList,
  loading: loading.models['userList/fetchPageListUserPlatformCouponAdmin'],
}))(VoucherPackage);
