import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import CITYJSON from '@/common/city';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import ProvCompanyDetailList from './components/Prov/ProvDetailList';

const ProvCompany = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '省公司名称',
      name: 'companyName',
    },
    {
      label: '代理省份',
      name: 'provinceCode',
      type: 'select',
      select: { list: CITYJSON.map((item) => ({ name: item.label, value: item.value })) },
    },
    {
      label: '联系人姓名',
      name: 'contactPerson',
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      dataIndex: 'userId',
      fixed: 'left',
      render: (val, row, i) => i + 1,
    },
    {
      title: '分管省份',
      fixed: 'left',
      dataIndex: 'agentProvinceName',
    },
    {
      title: '企业名称',
      fixed: 'left',
      dataIndex: 'companyName',
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactPerson',
    },
    {
      title: '联系人电话',
      dataIndex: 'contactMobile',
    },
    {
      title: '加盟日期',
      align: 'center',
      dataIndex: 'entryDate',
    },
    {
      title: '累计入驻店铺数',
      align: 'right',
      dataIndex: 'merchantCount',
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'totalIncome',
    },
    {
      title: '累计提现（卡豆）',
      align: 'right',
      dataIndex: 'totalWithdrawal',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'companyId',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '收益数据',
              click: () => setVisible({ type: 'income', record }),
            },
            {
              type: 'info',
              click: () => fetchProvComDetail({ type: 'income', record }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        btnExtra={
          <Button className="dkl_green_btn" key="1" onClick={() => handleSetActive()}>
            新增
          </Button>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.companyId}`}
        dispatchType="provCompany/fetchGetList"
        {...list}
      ></DataTableBlock>
      <ProvCompanyDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ provCompany, loading }) => ({
  list: provCompany.list,
  loading: loading.effects['provCompany/fetchGetList'],
}))(ProvCompany);
