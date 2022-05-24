import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import { BANK_CHECK_STATUS } from '@/common/constant';
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
    tab: '已审核',
  },
];

const SupplierAuth = (props) => {
  const tableRef = useRef();
  const { dispatch, loading, list } = props;

  const [tabkey, setTabKey] = useState('0');
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示

  //组建公用的搜索条件
  const searchItems = [
    {
      label: '供应商名称',
      name: 'ownerId',
      type: 'merchant',
      placeholder: '请输入集团或店铺名称',
    },
    {
      label: '供应商ID',
      name: 'districtCode',
    },
    {
      label: '申请时间',
      type: 'rangePicker',
      name: 'createTimeBegin',
      end: 'createTimeEnd',
    },
    {
      label: '审核结果',
      name: 'auditResult',
      type: 'select',
      show: tabkey === '1',
      select: BANK_CHECK_STATUS,
    },
    {
      label: '审核时间',
      type: 'rangePicker',
      name: 'auditTimeBegin',
      end: 'auditTimeEnd',
      show: tabkey === '1',
    },
    {
      label: '审核人',
      name: 'auditTimesaBegin',
      show: tabkey === '1',
    },
  ];

  // tab自组件Table公用的colum数据部分
  const getColumns = [
    {
      title: '供应商名称/ID',
      dataIndex: 'ownerId',
      render: (val, row) => {
        return (
          <div>
            <Ellipsis tooltip length={8}>
              {row.ownerName}
            </Ellipsis>
            <div>{val}</div>
          </div>
        );
      },
    },
    {
      title: '主营类目',
      dataIndex: 'ownerName',
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
      dataIndex: 'auditTime',
      show: tabkey === '1',
    },
    {
      title: '审核结果',
      dataIndex: 'auditResult',
      show: tabkey === '1',
      render: (val) => BANK_CHECK_STATUS[val],
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
      show: tabkey === '1',
    },
    {
      type: 'handle',
      dataIndex: 'ownerBankBindingInfoRecordId',
      render: (val, record) => {
        return [
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(val, 'info'),
          },
          {
            type: 'edit',
            click: () => fetchSpecialGoodsDetail(val, 'check'),
            visible: tabkey === '1',
          },
        ];
      },
    },
  ];

  // 获取详情
  const fetchSpecialGoodsDetail = (val, type) => {
    dispatch({
      type: 'bankChangeCheck/fetchGetBankBindingInfoRecordById',
      payload: { ownerBankBindingInfoRecordId: val },
      callback: (detail) => {
        setVisibleInfo({ type, detail, show: true });
      },
    });
  };

  const handleTabChange = (key) => {
    setTabKey(key);
    tableRef?.current?.fetchGetData({ auditStatus: key });
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
        params={{ auditStatus: tabkey }}
        rowKey={(record) => `${record.ownerBankBindingInfoRecordId}`}
        dispatchType="bankChangeCheck/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 详情 审核 */}
      <SupplierAuthDetail
        visible={visibleInfo}
        cRef={tableRef}
        onClose={() => setVisibleInfo(false)}
      ></SupplierAuthDetail>
    </>
  );
};
export default connect(({ loading, bankChangeCheck }) => ({
  list: bankChangeCheck.list,
  loading: loading.models.bankChangeCheck,
}))(SupplierAuth);
