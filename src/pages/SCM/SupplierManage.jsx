import React, { useRef, useState } from 'react';
import moment from 'moment';
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
import SupplierActivate from './components/SupplierManage/SupplierActivate';
import SupplierManageBrand from './components/SupplierManage/SupplierManageBrand';
import SupplierManageDetail from './components/SupplierManage/SupplierManageDetail';
import SupplierManageAddEdit from './components/SupplierManage/SupplierManageAddEdit';

const SupplierManage = (props) => {
  const { supplierManage, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增修改
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleBrand, setVisibleBrand] = useState(false); // 品牌管理
  const [visibleActivate, setVisibleActivate] = useState(false); // 账户激活

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
      disabledDate: (current) => current && current > moment().endOf('day').subtract(1, 'day'),
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
            <Tag color={row.type === '1' ? 'magenta' : 'cyan'}>{SUPPLIER_AUTH_TYPE[row.type]}</Tag>
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
          click: () => fetchGetDetail(index, 'info'),
        },
        {
          type: 'edit',
          click: () => fetchGetDetail(index, 'edit'),
        },
        {
          type: 'activate',
          visible: ['0', '2'].includes(row.bankStatus), // 未激活 激活失败
          click: () => setVisibleActivate({ show: true, detail: row }),
        },
        {
          type: 'brand',
          visible: ['1'].includes(row.status), // 启用
          click: () => setVisibleBrand({ show: true, id: val, name: row.name }),
        },
      ],
    },
  ];

  // 获取详情
  const fetchGetDetail = (index, mode = 'info') => {
    const { id } = supplierManage.list[index];
    dispatch({
      type: 'supplierManage/fetchGetSupplierManageDetail',
      payload: { supplierId: id, mode },
      callback: (detail) => {
        if (mode === 'info') setVisibleInfo({ show: true, index, detail });
        else if (mode === 'edit') setVisibleSet({ show: true, mode: 'edit', detail });
      },
    });
  };

  const btnList = [
    {
      auth: 'save',
      onClick: () => setVisibleSet({ show: true, mode: 'add' }),
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
      {/* 账户激活 */}
      <SupplierActivate
        cRef={childRef}
        visible={visibleActivate}
        onClose={() => setVisibleActivate(false)}
      ></SupplierActivate>
      {/* 新增 修改 */}
      <SupplierManageAddEdit
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
      ></SupplierManageAddEdit>
      {/* 品牌管理 */}
      <SupplierManageBrand
        visible={visibleBrand}
        onClose={() => setVisibleBrand(false)}
      ></SupplierManageBrand>
    </>
  );
};
export default connect(({ supplierManage, loading }) => ({
  supplierManage: supplierManage.list,
  loading: loading.models.supplierManage,
}))(SupplierManage);
