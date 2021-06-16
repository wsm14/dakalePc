import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { COMPANY_PROV_STATUS } from '@/common/constant';
import CITYJSON from '@/common/city';
import TableDataBlock from '@/components/TableDataBlock';
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
      select: CITYJSON,
      fieldNames: { label: 'label' },
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
    // {
    //   title: '累计收益（卡豆）',
    //   align: 'right',
    //   dataIndex: 'totalIncome',
    // },
    // {
    //   title: '累计提现（卡豆）',
    //   align: 'right',
    //   dataIndex: 'totalWithdrawal',
    // },
    {
      title: '状态',
      align: 'right',
      dataIndex: 'status',
      render: (val) => COMPANY_PROV_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'companyId',
      render: (companyId, record) => [
        // {
        //   title: '收益数据',
        //   auth: 'income',
        //   click: () => setVisible({ type: 'income', record }),
        // },
        {
          type: 'info',
          click: () => fetchProvDetail({ type: 'detail', companyId }),
        },
      ],
    },
  ];

  const extraBtn = [
    {
      auth: 'save',
      onClick: () => {
        dispatch({
          type: 'provCompany/fetchCloseData',
          callback: () => setVisibleSet({ type: 'add', show: true }),
        });
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        keepData
        cRef={childRef}
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.companyId}`}
        dispatchType="provCompany/fetchGetList"
        {...list}
      ></TableDataBlock>
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
