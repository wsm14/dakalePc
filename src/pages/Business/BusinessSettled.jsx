import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
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
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '绑卡日期',
      type: 'rangePicker',
      name: 'beginDate2',
      end: 'endDate2',
    },
    {
      label: '店铺',
      name: 'beginDatse2',
      placeholder: '请输入店铺账号、电话或名称',
    },
    {
      label: '审核状态',
      name: 'status',
      type: 'select',
      select: { list: [] },
    },
    {
      label: '激活状态',
      name: 'stsatus',
      type: 'select',
      select: { list: [] },
    },
    {
      label: '推荐人手机号',
      name: 'phone',
    },
    {
      label: '排序',
      name: 'phosne',
      type: 'select',
      select: { list: [] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'id',
    },
    {
      title: '类型',
      fixed: 'left',
      dataIndex: 'merchantName',
      render: (val) => val || '--',
    },
    {
      title: '店铺账号',
      fixed: 'left',
      dataIndex: 'username',
    },
    {
      title: '店铺电话',
      dataIndex: 'mobile',
      render: (val) => val || '--',
    },
    {
      title: '店铺名称',
      dataIndex: 'createTime',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '一级类目',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '二级类目',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '所属商圈',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '店铺地址',
      dataIndex: 'STATUS',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '提交审核日期',
      dataIndex: 'STATUS',
    },
    {
      title: '审核状态',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '审核通过日期',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '银行卡绑定日期',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '激活状态',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '关联BD',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '推店人名称',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
    {
      title: '推店人手机',
      dataIndex: 'STATUS',
      render: (val) => val || '--',
    },
  ];

  // 导出excel 数据
  const fetchGetExcel = (payload) => {
    const header = getColumns;
    dispatch({
      type: 'businessList/fetchMerchantGetExcel',
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
      rowKey={(record) => `${record.id}`}
      dispatchType="businessSettled/fetchGetList"
      {...businessSettled}
    ></DataTableBlock>
  );
};

export default connect(({ businessSettled, loading }) => ({
  businessSettled,
  loading: loading.effects['businessSettled/fetchGetList'],
}))(BusinessSettled);
