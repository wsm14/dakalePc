import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import CITYJSON from '@/common/city';
import { COMPANY_PROV_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import AreaCompanyDetailList from './components/Area/Detail/AreaDetailList';
import AreaCompanySet from './components/Area/Form/AreaCompanySet';
import AreaAccountSet from './components/Area/Form/AreaAccountSet';

const AreaCenter = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleSet, setVisibleSet] = useState(false);
  const [visibleAct, setVisibleAct] = useState(false);

  // 获取公司详情
  const fetchAreaDetail = (payload) => {
    dispatch({
      type: 'areaCenter/close',
    });
    dispatch({
      type: 'areaCenter/fetchAreaDetail',
      payload,
      callback: () => fetchAreaBankDetail(payload),
    });
  };

  // 获取公司账户详情
  const fetchAreaBankDetail = (payload) => {
    dispatch({
      type: 'areaCenter/fetchAreaBankDetail',
      payload: {
        ownerId: payload.partnerId,
        ownerType: 'partner',
      },
      callback: () => setVisibleSet({ type: payload.type, show: true }),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '所属省公司',
      name: 'belongProvinceCode',
      type: 'select',
      select: { list: CITYJSON.map((item) => ({ name: item.label, value: item.value })) },
    },
    {
      label: '代理公司名称',
      name: 'partnerName',
    },
    {
      label: '代理区县',
      type: 'cascader',
      name: 'districtCode',
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
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
      dataIndex: 'districtName',
      fixed: 'left',
      render: (val, row, i) => i + 1,
    },
    {
      title: '代理区县',
      fixed: 'left',
      dataIndex: 'agentDistrictName',
    },
    {
      title: '所属省公司',
      align: 'center',
      fixed: 'left',
      dataIndex: 'provinceName',
    },
    {
      title: '代理公司名称',
      align: 'center',
      dataIndex: 'partnerName',
    },
    {
      title: '联系人姓名',
      align: 'center',
      dataIndex: 'contactPerson',
    },
    {
      title: '联系人电话',
      align: 'right',
      dataIndex: 'contactMobile',
    },
    {
      title: '加盟日期',
      align: 'right',
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
      dataIndex: 'partnerStatus',
      render: (val) => COMPANY_PROV_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'partnerId',
      fixed: 'right',
      align: 'right',
      render: (partnerId, record) => (
        <HandleSetTable
          formItems={[
            // {
            //   type: 'own',
            //   auth: 'income',
            //   title: '收益明细',
            //   click: () => setVisible({ type: 'income', record }),
            // },
            // {
            //   type: 'own',
            //   auth: 'withdraw',
            //   title: '提现记录',
            //   click: () => setVisible({ type: 'withdraw', record }),
            // },
            {
              type: 'info',
              click: () => fetchAreaDetail({ type: 'detail', partnerId }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableDataBlock
        keepName
        cRef={childRef}
        btnExtra={
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              key="1"
              onClick={() => {
                dispatch({
                  type: 'areaCenter/fetchCloseData',
                  callback: () => setVisibleSet({ type: 'add', show: true }),
                });
              }}
            >
              新增
            </Button>
          </AuthConsumer>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.partnerId}`}
        dispatchType="areaCenter/fetchGetList"
        {...list}
      ></TableDataBlock>
      <AreaCompanyDetailList visible={visible} setVisible={setVisible} />
      <AreaCompanySet
        cRef={childRef}
        visible={visibleSet}
        setVisibleSet={setVisibleSet}
        setVisibleAct={setVisibleAct}
      ></AreaCompanySet>
      <AreaAccountSet
        cRef={childRef}
        visible={visibleAct}
        setVisibleSet={setVisibleSet}
        setVisibleAct={setVisibleAct}
      ></AreaAccountSet>
    </>
  );
};

export default connect(({ areaCenter, loading }) => ({
  list: areaCenter.list,
  loading: loading.models.areaCenter,
}))(AreaCenter);
