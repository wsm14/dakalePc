import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { MRE_ACCOUNT_STATUS, BUSINESS_STATUS_AUDIT, MRE_SORT_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import exportExcel from '@/utils/exportExcel';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessSettled = (props) => {
  const { businessSettled, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
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
      label: '审核状态',
      name: 'verifyStatus',
      type: 'select',
      select: { list: BUSINESS_STATUS_AUDIT },
    },
    {
      label: '激活状态',
      name: 'activationStatus',
      type: 'select',
      select: { list: MRE_ACCOUNT_STATUS },
    },
    {
      label: '推荐人手机号',
      name: 'parentMobile',
    },
    {
      label: '排序',
      name: 'sortField',
      type: 'select',
      select: { list: MRE_SORT_STATUS },
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
      dataIndex: 'merchantName',
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
      title: '提交审核日期',
      dataIndex: 'submitVerifyTime',
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
  ];

  // 导出excel 数据
  const fetchGetExcel = (payload) => {
    const header = getColumns;
    dispatch({
      type: 'businessSettled/fetchMerchantGetExcel',
      payload,
      callback: (data) => exportExcel({ header, data }),
    });
  };

  return (
    <DataTableBlock
      btnExtra={({ get }) => (
        <Button className="dkl_green_btn" key="1" onClick={() => fetchGetExcel(get())}>
          导出
        </Button>
      )}
      keepName="入驻查询"
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
