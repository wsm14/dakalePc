import React, { useRef, useState } from 'react';
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
    provinceName: '浙江',
    cityCode: '3301',
    cityName: '杭州',
    districtCode: '',
  });

  // 修改 / 新增
  const fetchSet = (values) => {
    const { businessHubId } = values;
    dispatch({
      type: businessHubId ? 'tradeArea/fetchTradeAreaEdit' : 'tradeArea/fetchTradeAreaAdd',
      payload: { ...values, provinceCode: selectCode.provinceCode },
      callback: () => {
        setVisible(null);
        childRef.current.fetchGetData();
      },
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
              click: () => setData({ ...record, businessHubId: val }),
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
        ...selectCode,
        ...info,
        provinceCode: [
          selectCode.provinceCode,
          selectCode.cityCode,
          selectCode.districtCode || info.districtCode,
        ],
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
