import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { FREE_COUPON_STATUS, FREE_COUPON_SCENE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const GetRecordModal = (props) => {
  const { visible, onClose, loading, getRecordList } = props;
  const { show = false, detail = {} } = visible;
  const { ownerCouponIdString = '' } = detail;

  // 搜索参数
  const searchItems = [
    {
      label: '领取人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '状态',
      type: 'select',
      name: 'couponStatus',
      select: FREE_COUPON_STATUS,
    },
    {
      label: '视频ID',
      name: 'momentId',
    },
    {
      label: '领取日期',
      type: 'rangePicker',
      name: 'receiveTimeBegin',
      end: 'receiveTimeEnd',
    },
    {
      label: '核销/使用日期',
      type: 'rangePicker',
      name: 'verificationTimeBegin',
      end: 'verificationTimeEnd',
    },
    {
      label: '领取场景',
      name: 'couponChannel',
      type: 'select',
      select: FREE_COUPON_SCENE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '领取人',
      align: 'center',
      dataIndex: 'username',
      render: (val, record) => (
        <div>
          <div>{val}</div>
          <div>{record.userMobile}</div>
          <div>{record.userBeanCode}</div>
        </div>
      ),
    },
    {
      title: '领取时间',
      align: 'center',
      dataIndex: 'receiveTime',
    },
    {
      title: '核销/使用时间',
      align: 'center',
      dataIndex: 'verificationTime',
    },
    {
      title: '领取场景',
      align: 'center',
      dataIndex: 'couponChannel',
      render: (val) => FREE_COUPON_SCENE[val],
    },
    {
      title: '关联视频ID',
      align: 'center',
      dataIndex: 'momentId',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'couponStatus',
      render: (val) => FREE_COUPON_STATUS[val],
    },
  ];

  const modalProps = {
    title: '领取核销记录',
    visible: show,
    width: 1000,
    onCancel: onClose,
  };
  return (
    <>
      <Modal {...modalProps} destroyOnClose>
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          rowKey={(record) => `${record.userCouponIdString}`}
          params={{ ownerCouponIdString: ownerCouponIdString }}
          dispatchType="couponManage/fetchListFreeReduceCouponReceiveVerificationRecord"
          {...getRecordList}
        ></TableDataBlock>
      </Modal>
    </>
  );
};

export default connect(({ couponManage, loading }) => ({
  getRecordList: couponManage.getRecordList,
  loading: loading.effects['couponManage/fetchListFreeReduceCouponReceiveVerificationRecord'],
}))(GetRecordModal);
