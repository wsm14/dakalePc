import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { COMPANY_PROV_STATUS } from '@/common/constant';
import { getCityName } from '@/utils/utils';
import CITYJSON from '@/common/city';
import TableDataBlock from '@/components/TableDataBlock';
import CityCompanySet from './components/City/Form/CityCompanySet';
import CityAccountSet from './components/City/Form/CityAccountSet';
import CityManageSet from './components/City/Form/CityManageSet';

const CityCompany = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 市级公司信息
  const [visibleAct, setVisibleAct] = useState(false); // 账户信息
  const [visibleArea, setVisibleArea] = useState(false); // 设置可管理区县

  // 获取市公司详情
  const fetchCityDetail = (payload) => {
    dispatch({
      type: 'cityCompany/close',
    });
    dispatch({
      type: 'cityCompany/fetchCityDetail',
      payload,
      callback: () => fetchCityBankDetail(payload),
    });
  };

  // 获取市公司账户详情
  const fetchCityBankDetail = (payload) => {
    dispatch({
      type: 'cityCompany/fetchCityBankDetail',
      payload: {
        ownerId: payload.cityId,
        ownerType: 'city',
      },
      callback: () => setVisibleSet({ type: payload.type, show: true }),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '市级公司名称',
      name: 'companyName',
    },
    {
      label: '代理城市',
      name: 'cityCode',
      type: 'cascader',
      select: CITYJSON.map((item) => ({
        ...item,
        children: item.children.map((citem) => ({ ...citem, children: undefined })),
      })),
      // fieldNames: { label: 'label' },
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
      title: '分管城市',
      fixed: 'left',
      dataIndex: 'agentCityCode',
      render: (val) => getCityName(val),
    },
    {
      title: '企业名称',
      fixed: 'left',
      dataIndex: 'companyName',
    },
    {
      title: '登录账号',
      dataIndex: 'contactMobile',
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
      align: 'center',
      dataIndex: 'merchantCount',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => COMPANY_PROV_STATUS[val],
    },
    {
      type: 'handle',
      align: 'center',
      dataIndex: 'cityId',
      render: (cityId, record) => [
        {
          type: 'info',
          click: () => fetchCityDetail({ type: 'detail', cityId }),
        },
        {
          type: 'set',
          visible: record.status !== '2',
          click: () => setVisibleArea({ show: true, detail: record }),
        },
      ],
    },
  ];

  const extraBtn = [
    {
      auth: 'save',
      onClick: () => {
        dispatch({
          type: 'cityCompany/fetchCloseData',
          callback: () => setVisibleSet({ type: 'add', show: true }),
        });
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.cityId}`}
        dispatchType="cityCompany/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 新增/编辑-市级公司信息 详情 */}
      <CityCompanySet
        cRef={childRef}
        visible={visibleSet}
        setVisibleSet={setVisibleSet}
        setVisibleAct={setVisibleAct}
      ></CityCompanySet>
      {/* 新增/编辑-账户信息 */}
      <CityAccountSet
        cRef={childRef}
        visible={visibleAct}
        setVisibleSet={setVisibleSet}
        setVisibleAct={setVisibleAct}
      ></CityAccountSet>
      {/* 设置可管理区县 */}
      <CityManageSet cRef={childRef} visible={visibleArea} onClose={() => setVisibleArea(false)} />
    </>
  );
};

export default connect(({ cityCompany, loading }) => ({
  list: cityCompany.list,
  loading: loading.models.cityCompany,
}))(CityCompany);
