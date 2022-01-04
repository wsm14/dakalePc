import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { SPREE_MANAGE_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

const SpreeUserUseInfo = (props) => {
  const { visible, onClose, loading, getUseInfoList, childRef } = props;
  const { show = false, detail = {} } = visible;
  const { platformGiftId, userId } = detail;

  // table 表头
  const getColumns = [
    {
      title: '券图片',
      align: 'center',
      dataIndex: 'couponImg',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '券/商品ID',
      align: 'center',
      dataIndex: 'ownerCouponIdString',
    },
    {
      title: '卡券类型',
      align: 'center',
      dataIndex: 'couponType',
      render: (val) => SPREE_MANAGE_TYPE[val],
    },
    {
      title: '券名/商品名称',
      align: 'center',
      dataIndex: 'couponName',
    },
    {
      title: '券价值',
      align: 'center',
      dataIndex: 'couponValue',
      render: (val) => `￥${val}`,
    },
    {
      title: '使用门槛',
      align: 'center',
      dataIndex: 'thresholdPrice',
    },
    {
      title: '券有效期',
      align: 'center',
      dataIndex: 'activeBeginDate',
      render: (val, row) => `${val}-${row.activeEndDate}`,
    },
    {
      title: '核销时间',
      align: 'center',
      dataIndex: 'verificationTime',
      render: (val) => {
        return val && '已核销';
      },
    },
    {
      title: '卡券状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'couponStatus',
      render: (val) => (
        <div style={{ color: '#1890ff' }}>{['未使用', '已过期', '已核销', false, '关闭'][val]}</div>
      ),
    },
  ];

  const modalProps = {
    title: '使用情况',
    visible: show,
    width: 1000,
    onCancel: onClose,
    afterClose: () => {
      childRef.current.fetchGetData();
    },
  };
  return (
    <>
      <Modal {...modalProps} destroyOnClose>
        <TableDataBlock
          noCard={false}
          loading={loading}
          columns={getColumns}
          // searchItems={searchItems}
          rowKey={(record) => `${record.userCouponIdString}`}
          params={{ userId: userId, platformGiftId: platformGiftId }}
          dispatchType="spreeManage/fetchListUserCouponByGift"
          {...getUseInfoList}
        ></TableDataBlock>
      </Modal>
    </>
  );
};

export default connect(({ spreeManage, loading }) => ({
  getUseInfoList: spreeManage.getUseInfoList,
  loading: loading.effects['spreeManage/fetchListUserCouponByGift'],
}))(SpreeUserUseInfo);
