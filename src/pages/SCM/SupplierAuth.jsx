import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import { SUPPLIER_AUTH_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import SupplierAuthDetail from './components/SupplierAuth/SupplierAuthDetail';

const tabList = [
  {
    key: '0',
    tab: '待审核',
  },
  {
    key: '1',
    tab: '审核通过',
  },
  {
    key: '2',
    tab: '审核拒绝',
  },
];

const SupplierAuth = (props) => {
  const { dispatch, loading, supplierAuth } = props;

  const tableRef = useRef();
  const [tabkey, setTabKey] = useState('0');
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示

  //组建公用的搜索条件
  const searchItems = [
    {
      label: '供应商名称',
      name: 'supplierName',
    },
    {
      label: '供应商ID',
      name: 'supplierId',
    },
    {
      label: '申请时间',
      type: 'rangePicker',
      name: 'submitBeginTime',
      end: 'submitEndTime',
    },
    {
      label: '审核时间',
      type: 'rangePicker',
      name: 'verifyBeginTime',
      end: 'verifyEndTime',
      show: tabkey !== '0',
    },
    {
      label: '审核人',
      name: 'verifierName',
      show: tabkey !== '0',
    },
  ];

  // tab自组件Table公用的colum数据部分
  const getColumns = [
    {
      title: '供应商名称/ID',
      dataIndex: 'supplierId',
      render: (val, row) => (
        <div>
          <Ellipsis tooltip length={8}>
            {row.supplierName}
          </Ellipsis>
          <div>{val}</div>
        </div>
      ),
    },
    {
      title: '主营类目',
      dataIndex: ['supplierObject', 'classifyNames'],
    },
    {
      title: '联系人',
      dataIndex: 'audisdtTime',
    },
    {
      title: '所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
    },
    {
      title: '审核时间',
      dataIndex: 'verifyTime',
      show: tabkey !== '0',
    },
    {
      title: '审核结果',
      dataIndex: 'verifyStatus',
      render: (val) => SUPPLIER_AUTH_STATUS[val],
      show: tabkey !== '0',
    },
    {
      title: '审核人',
      dataIndex: 'ownerName',
      show: tabkey !== '0',
    },
    {
      type: 'handle',
      dataIndex: 'identifyId',
      render: (val, record, index) => {
        return [
          {
            type: 'info',
            click: () => fetchGetDetail(index, 'check'),
          },
        ];
      },
    },
  ];

  // 获取详情
  const fetchGetDetail = (index, mode) => {
    const { identifyId } = supplierAuth.list[index];
    dispatch({
      type: 'bankChangeCheck/fetchGetBankBindingInfoRecordById',
      payload: { identifyId },
      callback: (detail) => {
        setVisibleInfo({ mode, detail, show: true });
      },
    });
  };

  const handleTabChange = (key) => {
    setTabKey(key);
    tableRef?.current?.fetchGetData({ verifyStatus: key });
  };

  return (
    <>
      <TableDataBlock
        order
        cardProps={{
          tabList,
          activeTabKey: tabkey,
          onTabChange: handleTabChange,
        }}
        cRef={tableRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ verifyStatus: tabkey }}
        rowKey={(record) => `${record.identifyId}`}
        dispatchType="supplierAuth/fetchGetList"
        {...supplierAuth}
      ></TableDataBlock>
      {/* 详情 审核 */}
      <SupplierAuthDetail
        visible={visibleInfo}
        cRef={tableRef}
        getDetail={fetchGetDetail}
        onClose={() => setVisibleInfo(false)}
      ></SupplierAuthDetail>
    </>
  );
};
export default connect(({ loading, supplierAuth }) => ({
  supplierAuth,
  loading: loading.models.supplierAuth,
}))(SupplierAuth);
