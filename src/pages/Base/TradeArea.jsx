import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Switch, Card } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import TableDataBlock from '@/components/TableDataBlock';
import TradeAreaLeft from './components/TradeArea/Left';
import TradeAreaSet from './components/TradeArea/Form/TradeAreaSet';

const TradeArea = (props) => {
  const { loading, dispatch, tradeArea } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(null);
  const [selectCode, setSelectCode] = useState({
    provinceCode: '33',
    provinceName: '浙江省',
    cityCode: '3301',
    cityName: '杭州市',
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
        childRef.current.fetchGetData({ ...selectCode });
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
        <AuthConsumer auth="edit" noAuth={val === '1' ? '启用' : '停用'}>
          <Switch
            checkedChildren="启"
            unCheckedChildren="停"
            checked={val === '1'}
            onClick={() => fetchSet({ businessHubId: record.businessHubIdString, status: 1 ^ val })}
          />
        </AuthConsumer>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'businessHubIdString',
      render: (val, record) => [
        {
          type: 'edit',
          click: () => setData({ ...record, businessHubId: val }),
        },
      ],
    },
  ];

  const setData = (info = {}) => {
    setVisible({
      visible: true,
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

  // 表格额外按钮

  const extraBtn = [
    {
      text: '新增商圈',
      auth: 'save',
      disabled: !(selectCode.districtCode && selectCode.cityCode),
      onClick: () => setData(),
    },
  ];

  return (
    <Card bordered={false} bodyStyle={{ display: 'flex' }}>
      <TradeAreaLeft
        cRef={childRef}
        selectCode={selectCode}
        setSelectCode={setSelectCode}
      ></TradeAreaLeft>
      <div style={{ flex: 1 }}>
        <TableDataBlock
          btnExtra={extraBtn}
          noCard={false}
          cRef={childRef}
          loading={loading}
          searchItems={searchItems}
          columns={getColumns}
          params={{ cityCode: '3301' }}
          rowKey={(record) => `${record.businessHubIdString}`}
          dispatchType="tradeArea/fetchGetList"
          {...tradeArea}
        ></TableDataBlock>
      </div>
      <TradeAreaSet
        {...visible}
        onSubmit={fetchSet}
        onClose={() => setVisible(null)}
      ></TradeAreaSet>
    </Card>
  );
};

export default connect(({ tradeArea, loading }) => ({
  tradeArea,
  loading: loading.models.tradeArea,
}))(TradeArea);
