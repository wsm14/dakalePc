import React, { useRef, useState } from 'react';
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
import SupplierManageDetail from './components/SupplierManage/SupplierManageDetail';

const SupplierManage = (props) => {
  const { supplierManage, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示

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
      type: 'handle',
      width: 200,
      dataIndex: 'id',
      render: (val, row, index) => [
        {
          type: 'info',
          click: () => fetchGetDetail(index),
        },
        {
          type: 'edit',
          click: () => fetchGetDetail(val, row.momentCommentIdString),
        },
        {
          type: 'activate',
          visible: ['0', '2'].includes(row.bankStatus), // 未激活 激活失败
          click: () => fetchGetDetail(val, row.momentCommentIdString),
        },
        {
          type: 'brand',
          visible: ['1'].includes(row.status), // 启用
          click: () => fetchGetDetail(val, row.momentCommentIdString),
        },
        {
          type: 'diary',
          click: () => fetchGetDetail(val, row.momentCommentIdString),
        },
      ],
    },
  ];

  // 获取详情
  const fetchGetDetail = (index) => {
    const { id } = supplierManage.list[index];
    dispatch({
      type: 'supplierManage/fetchGetSupplierManageDetail',
      payload: { supplierId: id },
      callback: (detail) => {
        setVisibleInfo({ detail, show: true });
      },
    });
  };

  const btnList = [
    {
      auth: 'save',
      onClick: fetchGetDetail,
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
        rowKey={(record) => `${record.id}`}
        dispatchType="supplierManage/fetchGetList"
        {...supplierManage}
      ></TableDataBlock>
      {/* 详情 */}
      <SupplierManageDetail
        cRef={childRef}
        visible={visibleInfo}
        getDetail={fetchGetDetail}
        onClose={() => setVisibleInfo(false)}
      ></SupplierManageDetail>
    </>
  );
};
export default connect(({ supplierManage, loading }) => ({
  supplierManage,
  loading: loading.models.supplierManage,
}))(SupplierManage);
