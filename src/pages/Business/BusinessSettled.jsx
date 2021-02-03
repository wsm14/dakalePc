import React, { useRef } from 'react';
import { connect } from 'umi';
import { Popover } from 'antd';
import {
  MRE_ACCOUNT_STATUS,
  BUSINESS_STATUS_AUDIT,
  MRE_SORT_STATUS,
  BUSINESS_TYPE,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import ExcelButton from '@/components/ExcelButton';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessSettled = (props) => {
  const { businessSettled, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '审核通过',
      type: 'rangePicker',
      name: 'verifyTimeStart',
      end: 'verifyTimeEnd',
    },
    {
      label: '提审时间',
      type: 'rangePicker',
      name: 'arraignmentTimeStart',
      end: 'arraignmentTimeEnd',
    },
    {
      label: '绑卡日期',
      type: 'rangePicker',
      name: 'activationTimeStart',
      end: 'activationTimeEnd',
    },
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      label: '店铺帐号',
      name: 'account',
    },
    {
      label: 'BD姓名',
      name: 'salespersonName',
    },
    {
      label: '店铺类型',
      name: 'merchantType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '省市区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '审核状态',
      name: 'verifyStatus',
      type: 'select',
      select: BUSINESS_STATUS_AUDIT,
    },
    {
      label: '激活状态',
      name: 'activationStatus',
      type: 'select',
      select: MRE_ACCOUNT_STATUS,
    },
    {
      label: '推荐人手机号',
      name: 'parentMobile',
    },
    {
      label: '排序',
      name: 'sortField',
      type: 'select',
      select: MRE_SORT_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'id',
      render: (val, row, i) => i + 1,
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (val) => val || '--',
    },
    {
      title: '店铺账号',
      dataIndex: 'account',
    },
    {
      title: '店铺电话',
      dataIndex: 'mobile',
      render: (val) => val || '--',
    },
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '一级类目',
      dataIndex: 'topCategoryName',
      render: (val) => val || '--',
    },
    {
      title: '二级类目',
      dataIndex: 'categoryName',
      render: (val) => val || '--',
    },
    {
      title: '所属商圈',
      dataIndex: 'businessHub',
      render: (val) => val || '--',
    },
    {
      title: '店铺地址',
      dataIndex: 'address',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '店铺服务费',
      align: 'right',
      dataIndex: 'commissionRatio',
      render: (val, row) => (row.bankStatus === '3' ? val + '%' : '--'),
    },
    {
      title: '赠送卡豆',
      align: 'right',
      dataIndex: 'bondBean',
      render: (val, row) => (row.bankStatus === '3' ? val : '--'),
    },
    {
      title: '提交审核日期',
      dataIndex: 'submitVerifyTime',
      render: (val) => val || '--',
    },
    {
      title: '审核状态',
      dataIndex: 'verifyStatus',
      render: (val) => BUSINESS_STATUS_AUDIT[val],
    },
    {
      title: '审核通过日期',
      dataIndex: 'verifyTime',
      render: (val) => val || '--',
    },
    {
      title: '银行卡绑定日期',
      dataIndex: 'activationTime',
      render: (val) => val || '--',
    },
    {
      title: '激活状态',
      dataIndex: 'bankStatus',
      render: (val) => MRE_ACCOUNT_STATUS[val],
    },
    {
      title: '关联BD',
      dataIndex: 'salesperson',
      render: (val) => val || '--',
    },
    {
      title: '推店人名称',
      dataIndex: 'parentName',
      render: (val) => val || '--',
    },
    {
      title: '推店人手机',
      dataIndex: 'parentMobile',
      render: (val) => val || '--',
    },
    {
      title: '操作',
      dataIndex: 'userMerchantIdString',
      fixed: 'right',
      align: 'right',
      render: (val, row) =>
        row.bankStatus === '2' && (
          <Popover placement="left" content={row.failureReason} trigger="click">
            <a>失败原因</a>
          </Popover>
        ),
    },
  ];

  return (
    <DataTableBlock
      keepName="入驻绑定查询"
      btnExtra={({ get }) => (
        <ExcelButton
          dispatchType={'businessSettled/fetchMerchantGetExcel'}
          dispatchData={get()}
          exportProps={{ header: getColumns.slice(0, -1) }}
        ></ExcelButton>
      )}
      pParams={{ searchData: { sortField: '1' } }}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMerchantIdString}`}
      dispatchType="businessSettled/fetchGetList"
      {...businessSettled}
    ></DataTableBlock>
  );
};

export default connect(({ businessSettled, loading }) => ({
  businessSettled,
  loading: loading.models.businessSettled,
}))(BusinessSettled);
