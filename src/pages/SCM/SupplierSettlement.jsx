import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import SettlementDrawer from './components/SupplierSettlement/SettlementDrawer';

const SupplierSettlement = (props) => {
  const { supplierSettlement, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({ mode: 'info', show: false, detail: {} });

  // 搜索参数
  const searchItems = [
    {
      label: '供应商名称',
      name: 'supplierName',
    },
    {
      label: '结算流水号',
      name: 'settleNum',
    },
    {
      label: '结算时间',
      type: 'rangePicker',
      name: 'settleBeginTime',
      end: 'settleEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      ellipsis: { length: 15 },
    },
    {
      title: '结算流水号',
      dataIndex: 'settleNum',
    },
    {
      title: '结算金额',
      dataIndex: 'settleAmount',
      render: (val) => `￥${val}`,
    },
    {
      title: '结算时间',
      dataIndex: 'settleTime',
    },
    {
      title: '制单人',
      dataIndex: 'preparer',
    },
    {
      title: '制单时间',
      dataIndex: 'createTime',
    },
    {
      type: 'handle',
      dataIndex: 'supplierSettlementId',
      render: (val, row, index) => [
        {
          type: 'info',
          click: () => fetchGetSettlementDetail(index, 'info'),
        },
        {
          type: 'edit',
          click: () => fetchGetSettlementDetail(index, 'edit'),
        },
      ],
    },
  ];

  // 获取详情
  const fetchGetSettlementDetail = (index, mode) => {
    const { supplierSettlementId } = supplierSettlement.list[index];
    dispatch({
      type: 'supplierSettlement/fetchGetSupplierSettlementDetail',
      payload: { supplierSettlementId, mode },
      callback: (detail) => {
        setVisible({ mode, show: true, index, detail });
      },
    });
  };

  const btnList = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisible({ mode: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        btnExtra={btnList}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.supplierSettlementId}`}
        dispatchType="supplierSettlement/fetchGetList"
        {...supplierSettlement}
      ></TableDataBlock>
      {/* 详情编辑新增 */}
      <SettlementDrawer
        childRef={childRef}
        visible={visible}
        getDetail={fetchGetSettlementDetail}
        onClose={() => setVisible(false)}
      ></SettlementDrawer>
    </>
  );
};
export default connect(({ supplierSettlement, loading }) => ({
  supplierSettlement,
  loading: loading.models.supplierSettlement,
}))(SupplierSettlement);
