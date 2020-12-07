import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import CITYJSON from '@/common/city';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import ProvCompanyDetailList from './components/Prov/Detail/ProvDetailList';
import ProvCompanySet from './components/Prov/Form/ProvCompanySet';
import ProvAccountSet from './components/Prov/Form/ProvAccountSet';

const ProvCompany = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleSet, setVisibleSet] = useState(false);
  const [visibleAct, setVisibleAct] = useState(false);

  // 获取省公司详情
  const fetchProvDetail = (payload) => {
    dispatch({
      type: 'provCompany/close',
    });
    dispatch({
      type: 'provCompany/fetchProvDetail',
      payload,
      callback: () => fetchProvBankDetail(payload),
    });
  };

  // 获取省公司账户详情
  const fetchProvBankDetail = (payload) => {
    dispatch({
      type: 'provCompany/fetchProvBankDetail',
      payload: {
        ownerId: payload.companyId,
        ownerType: 'company',
      },
      callback: () => setVisibleSet({ type: payload.type, show: true }),
    });
  };

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
      render: (companyId, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '收益数据',
              click: () => setVisible({ type: 'income' }),
            },
            {
              type: 'info',
              click: () => fetchProvDetail({ type: 'detail', companyId }),
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
          <Button
            className="dkl_green_btn"
            key="1"
            onClick={() => {
              dispatch({
                type: 'provCompany/close',
              });
              setVisibleSet({ type: 'add', show: true });
            }}
          >
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
      <ProvCompanySet
        cRef={childRef}
        visible={visibleSet}
        setVisibleSet={setVisibleSet}
        setVisibleAct={setVisibleAct}
      ></ProvCompanySet>
      <ProvAccountSet
        cRef={childRef}
        visible={visibleAct}
        setVisibleSet={setVisibleSet}
        setVisibleAct={setVisibleAct}
      ></ProvAccountSet>
    </>
  );
};

export default connect(({ provCompany, loading }) => ({
  list: provCompany.list,
  loading: loading.models.provCompany,
}))(ProvCompany);
