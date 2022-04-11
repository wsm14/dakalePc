import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import ImportDetail from './ImportDetail';

const ImportRecord = (props) => {
  const { visible = {}, onClose, loading, platformCouponList } = props;
  const { show, detail } = visible;
  const childRef = useRef();
  const [infoVisible, setInfoVisible] = useState(false);

  const getColumns = [
    {
      title: '导入时间',
      dataIndex: 'importTime',
    },

    {
      title: '操作账号',
      dataIndex: 'importer',
    },
    {
      title: '导入状态',
      dataIndex: 'status',
      render: (val) => ['导入中', '部分失败', '成功', '失败'][val],
    },
    {
      title: '导入成功条数',
      dataIndex: 'successNumber',
    },
    {
      title: '导入失败条数',
      dataIndex: 'failureNumber',
    },
    {
      type: 'handle',
      title: '操作失败详情',
      dataIndex: 'platformCouponId',
      render: (platformCouponId, row) => {
        return [
          {
            type: 'info',
            title: '查看',
            auth: true,
            click: () => {
              setInfoVisible({ show: true, detail: row });
            },
          },
        ];
      },
    },
  ];

  const modalProps = {
    title: `查看导入记录`,
    width: 1000,
    visible: show,
    onCancel: onClose,
    zIndex: 1002,
    footer: [
      <Button key="ok" onClick={onClose}>
        返回
      </Button>,
    ],
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
    destroyOnClose: true,
  };

  return (
    <>
      <Modal {...modalProps}>
        <TableDataBlock
          order
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          params={{ platformCouponId: detail?.platformCouponId }}
          rowKey={(record) => `${record.platformCouponGiveImportId}`}
          dispatchType="platformCoupon/fetchGiveImportGetList"
          {...platformCouponList}
        ></TableDataBlock>
      </Modal>

      <ImportDetail
        visible={infoVisible}
        onClose={() => {
          setInfoVisible(false);
        }}
      ></ImportDetail>
    </>
  );
};

export default connect(({ platformCoupon, loading }) => ({
  platformCouponList: platformCoupon.importList,
  loading: loading.effects['platformCoupon/fetchGiveImportGetList'],
}))(ImportRecord);
