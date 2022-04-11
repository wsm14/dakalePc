import React, { useRef } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import DrawerCondition from '@/components/DrawerCondition';

const ImportDetail = (props) => {
  const { visible, onClose, loading, platformCouponList } = props;
  const { show, detail = {} } = visible;
  const childRef = useRef();

  const getColumns = [
    {
      title: '行数',
      dataIndex: 'line',
    },
    {
      title: '用户id',
      dataIndex: 'userId',
    },
    {
      title: '错误信息',
      dataIndex: 'failureReason',
    },
  ];
  // 弹窗属性
  const modalProps = {
    title: '导入失败详情',
    visible: show,
    zIndex: 1003,
    onClose,
    destroyOnClose: true,
    maskClosable: true,
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        <TableDataBlock
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          params={{ platformCouponGiveImportId: detail?.platformCouponGiveImportId }}
          rowKey={(record) => `${record.platformCouponGiveImportDetailId}`}
          dispatchType="platformCoupon/fetchGiveImportGetListDetail"
          {...platformCouponList}
        ></TableDataBlock>
      </DrawerCondition>
    </>
  );
};

export default connect(({ loading, platformCoupon }) => ({
  platformCouponList: platformCoupon.importDetailList,
  loading: loading.effects['platformCoupon/fetchGiveImportGetListDetail'],
}))(ImportDetail);
