import React, { useRef } from 'react';
import { connect } from 'umi';
import { Tag, Badge } from 'antd';
import { checkCityName } from '@/utils/utils';
import {
  SUPPLIER_STATUS,
  SUPPLIER_AUTH_TYPE,
  BUSINESS_ACCOUNT_STATUS,
  SUPPLIER_ACCOUNT_STATUS_SHOW,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

const SupplierManage = (props) => {
  const { supplierManage, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '供应商名称',
      name: 'name',
    },
    {
      label: '供应商ID',
      name: 'supplierId',
    },
    {
      label: '联系人',
      name: 'contactName',
    },
    {
      label: '所属地区',
      name: 'city',
      type: 'cascader',
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '入驻时间',
      type: 'rangePicker',
      name: 'settleBeginTime',
      end: 'settleEndTime',
    },
    {
      label: '供应商类型',
      name: 'type',
      type: 'select',
      select: SUPPLIER_AUTH_TYPE,
    },
    {
      label: '供应商状态',
      name: 'status',
      type: 'select',
      select: SUPPLIER_STATUS,
    },
    {
      label: '账户状态',
      name: 'accountStatus',
      type: 'select',
      select: BUSINESS_ACCOUNT_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '供应商名称/ID',
      dataIndex: 'name',
      render: (val, row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tag color={row.type === '1' ? 'magenta' : 'red'}>{SUPPLIER_AUTH_TYPE[row.type]}</Tag>
            <Ellipsis tooltip length={8}>
              {val}
            </Ellipsis>
          </div>
          <div>{row.id}</div>
        </div>
      ),
    },
    {
      title: '主营类目',
      dataIndex: 'classifyNames',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
    },
    {
      title: '供应商状态',
      dataIndex: 'status',
      render: (val) => (
        <Badge status={val === '1' ? 'success' : 'error'} text={SUPPLIER_STATUS[val]} />
      ),
    },
    {
      title: '账户状态',
      dataIndex: 'bankStatus',
      render: (val) => SUPPLIER_ACCOUNT_STATUS_SHOW[val],
    },
    {
      title: '所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '入驻时间',
      dataIndex: 'settleTime',
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'id',
      render: (val, row) => [
        {
          type: 'info',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
        {
          type: 'edit',
          visible: val === '0',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
        {
          type: 'activate',
          visible: val === '0',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
        {
          type: 'brand',
          visible: val === '0',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
        {
          type: 'diary',
          visible: val === '0',
          click: () => fetchDel(val, row.momentCommentIdString),
        },
      ],
    },
  ];
  const fetchDel = (deleteFlag) => {
    dispatch({
      type: 'commentManage/fetchUpdateCommentsDeleteFlag',
      payload: {
        deleteFlag: deleteFlag == '0' ? 1 : 0,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  const btnList = [
    {
      auth: 'save',
      onClick: fetchDel,
    },
  ];

  return (
    <TableDataBlock
      order
      cRef={childRef}
      btnExtra={btnList}
      loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      rowKey={(record) => `${record.id}`}
      dispatchType="supplierManage/fetchGetList"
      {...supplierManage}
    ></TableDataBlock>
  );
};
export default connect(({ supplierManage, loading }) => ({
  supplierManage,
  loading: loading.models.supplierManage,
}))(SupplierManage);
