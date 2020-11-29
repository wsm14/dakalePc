import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Switch, Button, Card } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import TradeAreaLeft from './components/TradeArea/Left';
import TradeAreaSet from './components/TradeArea/Form/TradeAreaSet';

const TradeArea = (props) => {
  const { loading, dispatch, tradeArea } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(null);
  const [selectCode, setSelectCode] = useState({
    provinceCode: '33',
    cityCode: '3301',
    districtCode: '',
  });

  // 修改 / 新增
  const fetchSet = (values) => {
    const { businessHubId } = values;
    const obj = { ...values, ...selectCode };
    dispatch({
      type: businessHubId ? 'tradeArea/fetchTradeAreaEdit' : 'tradeArea/fetchTradeAreaAdd',
      payload: businessHubId ? values : obj,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '商圈名称',
      name: 'businessHubName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '区域名称',
      dataIndex: 'districtName',
    },
    {
      title: '商圈名称',
      align: 'center',
      dataIndex: 'businessHubName',
    },
    {
      title: '商圈地址',
      align: 'center',
      dataIndex: 'businessHubAddress',
    },
    {
      title: '商圈半径',
      align: 'center',
      dataIndex: 'radius',
      render: (val) => `${val / 1000}km`,
    },
    {
      title: '启用状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'status',
      render: (val, record) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          onClick={() => fetchSet({ businessHubId: record.businessHubIdString, status: 1 ^ val })}
        />
      ),
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'businessHubIdString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => setData({ businessHubId: val, ...record }),
            },
          ]}
        />
      ),
    },
  ];

  const setData = (info = {}) => {
    setVisible({
      visible: true,
      fetchSet,
      onClose: () => setVisible(null),
      info: {
        ...info,
        provinceCode: [selectCode.provinceCode, selectCode.cityCode, selectCode.districtCode],
      },
    });
  };

  return (
    <Card bordered={false} bodyStyle={{ display: 'flex' }}>
      <TradeAreaLeft
        cRef={childRef}
        selectCode={selectCode}
        setSelectCode={setSelectCode}
      ></TradeAreaLeft>
      <div style={{ flex: 1 }}>
        <DataTableBlock
          btnExtra={
            <Button
              className="dkl_green_btn"
              disabled={!(selectCode.districtCode && selectCode.cityCode)}
              key="1"
              onClick={() => setData()}
            >
              新增商圈
            </Button>
          }
          CardNone={false}
          cRef={childRef}
          loading={loading}
          searchItems={searchItems}
          columns={getColumns}
          params={{ cityCode: '3301' }}
          rowKey={(record) => `${record.businessHubIdString}`}
          dispatchType="tradeArea/fetchGetList"
          {...tradeArea}
        ></DataTableBlock>
      </div>
      <TradeAreaSet {...visible}></TradeAreaSet>
    </Card>
  );
};

export default connect(({ tradeArea, loading }) => ({
  tradeArea,
  loading: loading.models.tradeArea,
}))(TradeArea);
