import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import CityPartnerDetailList from './components/CityPartner/CityPartnerDetailList';
import CityPartnerTotalInfo from './components/CityPartner/CityPartnerTotalInfo';
import cityPartnerSet from './components/CityPartner/CityPartnerDetail';

const CityPartner = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '企业名称',
      name: 'userMobile1s',
    },
    {
      label: '手机号',
      name: 'userMosbile1s',
    },
    {
      label: '姓名',
      name: 'userMobile1',
    },
    {
      label: '区域',
      name: 'userMo',
      type: 'select',
      select: { list: [] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '姓名',
      dataIndex: 'userId',
      fixed: 'left',
    },
    {
      title: '手机号',
      align: 'center',
      fixed: 'left',
      dataIndex: 'phoneNumber',
    },
    {
      title: '企业名称',
      align: 'center',
      dataIndex: 'orderCount',
    },
    {
      title: '代理区域',
      align: 'center',
      dataIndex: 'aa',
    },
    {
      title: '所在城市',
      align: 'center',
      dataIndex: 'aaas',
    },
    {
      title: '区域店铺数',
      align: 'center',
      dataIndex: 'aaasdas',
    },
    {
      title: '累计收益',
      align: 'right',
      dataIndex: 'bb',
    },
    {
      title: '累计提现',
      align: 'right',
      dataIndex: 'addTimeStamp',
    },
    {
      title: '加盟日期',
      align: 'right',
      dataIndex: 'addTimeStamp',
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
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
              click: () => fetchProvComDetail({ type: 'income', record }),
            },
          ]}
        />
      ),
    },
  ];

  // 获取公司详情
  const fetchProvComDetail = () => {
    dispatch({
      type: 'cityPartner/fetchProvComDetail',
      payload: {},
      callback: handleSetActive,
    });
  };

  // 设置
  const handleSetActive = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: cityPartnerSet({ dispatch, childRef, payload: { initialValues: '' } }),
    });
  };

  useEffect(() => {
    dispatch({
      type: 'cityPartner/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <CityPartnerTotalInfo
        btnExtra={
          <Button className="dkl_green_btn" key="1" onClick={() => handleSetActive()}>
            新增合伙人
          </Button>
        }
      ></CityPartnerTotalInfo>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
        dispatchType="cityPartner/fetchGetList"
        {...list}
        list={[{ name: 1 }]}
      ></DataTableBlock>
      <CityPartnerDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ cityPartner, loading }) => ({
  list: cityPartner.list,
  loading: loading.effects['cityPartner/fetchGetList'],
}))(CityPartner);
