import React from 'react';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const ImportRecord = (props) => {
  const { visible = {} } = props;
  const { show, detail } = visible;
  const childRef = useRef();

  const getColumns = [
    {
      title: '剩余数量',
      dataIndex: 'remain',
    },
    {
      title: '状态',
      dataIndex: 'couponStatus',
      render: (val) => (val === '1' ? '上架中' : '已下架'),
    },
  ];

  const modalProps = {
    title: `查看导入记录`,
    visible: show,
    onCancel: onClose,
    footer: [
      <Button key="ok" type="primary" onClick={onClose}>
        返回
      </Button>,
    ],
  };

  return (
    <Modal {...modalProps}>
      <TableDataBlock
        order
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.platformCouponId}`}
        dispatchType="platformCoupon/fetchGetList"
        {...platformCouponList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ platformCoupon, loading }) => ({
  platformCouponList: platformCoupon.list,
  loading:
    loading.effects['platformCoupon/fetchGetList'] ||
    loading.effects['platformCoupon/fetchGetPlatformCouponDetail'],
}))(ImportRecord);
