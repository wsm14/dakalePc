import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { useLocation } from 'umi';
import { KeepAlive } from 'react-activation';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import CityPartnerDetailList from './components/CityPartner/CityPartnerDetailList';
// import CityPartnerTotalInfo from './components/CityPartner/CityPartnerTotalInfo';
import cityPartnerSet from './components/CityPartner/CityPartnerDetail';

const CityPartner = (props) => {
  const { list, loading, dispatch } = props;

  const match = useLocation();
  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '企业名称',
      name: 'companyName',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '姓名',
      name: 'partnerName',
    },
    {
      label: '区域',
      name: 'city',
      type: 'city',
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '姓名',
      fixed: 'left',
      dataIndex: 'partnerName',
    },
    {
      title: '手机号',
      align: 'center',
      fixed: 'left',
      dataIndex: 'partnerMobile',
    },
    {
      title: '企业名称',
      align: 'center',
      dataIndex: 'companyName',
    },
    {
      title: '代理区域',
      align: 'center',
      dataIndex: 'districtName',
    },
    {
      title: '所在城市',
      align: 'center',
      dataIndex: 'cityName',
    },
    {
      title: '区域店铺数',
      align: 'center',
      dataIndex: 'merchantCount',
    },
    {
      title: '累计收益',
      align: 'right',
      dataIndex: 'totalIncome',
    },
    {
      title: '累计提现',
      align: 'right',
      dataIndex: 'totalWithdrawal',
    },
    {
      title: '加盟日期',
      align: 'right',
      dataIndex: 'joinTime',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'partnerIdString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '收益数据',
              click: () => setVisible({ type: 'income', record }),
            },
            {
              type: 'own',
              title: '提现记录',
              click: () => setVisible({ type: 'withdraw', record }),
            },
            {
              type: 'info',
              click: () => handleSetActive(record),
            },
          ]}
        />
      ),
    },
  ];

  // 设置
  const handleSetActive = (initialValues = '') => {
    dispatch({
      type: 'drawerForm/show',
      payload: cityPartnerSet({ dispatch, childRef, payload: { initialValues } }),
    });
  };

  useEffect(() => {
    dispatch({
      type: 'cityPartner/clearDetail',
    });
  }, [visible]);

  return (
    <>
      {/* <CityPartnerTotalInfo
        btnExtra={
          <Button className="dkl_green_btn" key="1" onClick={() => handleSetActive()}>
            新增合伙人
          </Button>
        }
      ></CityPartnerTotalInfo> */}
      <DataTableBlock
        btnExtra={
          <Button className="dkl_green_btn" key="1" onClick={() => handleSetActive()}>
            新增合伙人
          </Button>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.partnerIdString}`}
        dispatchType="cityPartner/fetchGetList"
        {...list}
      ></DataTableBlock>
      <CityPartnerDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ cityPartner, loading }) => ({
  list: cityPartner.list,
  loading: loading.effects['cityPartner/fetchGetList'],
}))(CityPartner);
