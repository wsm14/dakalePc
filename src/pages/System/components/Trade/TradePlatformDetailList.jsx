import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal, Button, Table } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import tradePlatformSet from './TradePlatformSet';

const TradePlatformDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { record = '' } = visible;

  const childRef = useRef();

  //  新增 修改 CeditType 1 面积新增 2 面积修改 3 服务费新增修改
  const handleDataSet = (CeditType, initialValues, configMerchantSettleId, rowData) => {
    dispatch({
      type: 'drawerForm/show',
      payload: tradePlatformSet({
        dispatch,
        childRef,
        initialValues,
        categoryId: record.id,
        configMerchantSettleId,
        CeditType,
        rowData,
      }),
    });
  };

  // 删除面积
  const fetchDataDel = (value) => {
    dispatch({
      type: 'sysTradeList/fetchTradePlatformSet',
      payload: { configMerchantSettleId: value, deleteFlag: 0 },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 删除服务费
  const fetchDataRowDel = (value, data) => {
    const { merchantSettleObjects: pObj = [], configMerchantSettleIdString } = data;
    dispatch({
      type: 'sysTradeList/fetchTradePlatformSet',
      payload: {
        ...data,
        categoryId: record.id,
        configMerchantSettleId: configMerchantSettleIdString,
        merchantSettleObjects: pObj.filter((item) => item.serviceFee !== value.serviceFee),
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 默认数据 不存在面积时 就一个数组
  const columns = (data = detailList.list[0]) => {
    return [
      {
        title: '服务费比例（%）',
        align: 'center',
        dataIndex: 'serviceFee',
      },
      {
        title: '赠送卡豆（个）',
        align: 'center',
        dataIndex: 'freeBean',
      },
      {
        title: '操作',
        align: 'right',
        dataIndex: 'configMerchantSettleIdString',
        render: (val, red) => (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () => handleDataSet(3, red, '', data),
              },
              {
                type: 'del',
                click: () => fetchDataRowDel(red, data),
              },
            ]}
          />
        ),
      },
    ];
  };

  const rowTable = (data, rowData) => (
    <Table
      columns={columns(rowData)}
      dataSource={data}
      rowKey={(row) => `${row.freeBean}`}
      pagination={false}
      componentSize="middle"
    />
  );

  // table
  const getColumns = [
    {
      title: '服务费设置（面积 / m²）',
      align: 'center',
      dataIndex: 'typeContent',
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'configMerchantSettleIdString',
      render: (val, red) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '新增服务费',
              click: () => handleDataSet(3, '', val, red),
            },
            {
              type: 'edit',
              click: () => {
                const area = red.typeContent;
                let areaArr = [];
                if (area.indexOf('-') !== -1) {
                  areaArr = area.split('-');
                } else {
                  const num = area.split('以')[0];
                  areaArr = { true: [num, ''], false: [0, num] }[area.indexOf('上') !== -1];
                }
                handleDataSet(2, { areaMin: areaArr[0], areaMax: areaArr[1] }, val);
              },
            },
            {
              type: 'del',
              click: () => fetchDataDel(val),
            },
          ]}
        />
      ),
    },
  ];

  const propsItem = {
    true: {
      columns: columns(),
      rowKey: 'freeBean',
      list: detailList.list.length ? detailList.list[0].merchantSettleObjects : [],
      btnExtra: (
        <Button
          className="dkl_green_btn"
          onClick={() => handleDataSet(3, '', 999, detailList.list[0])}
        >
          新增
        </Button>
      ),
    },
    false: {
      columns: getColumns,
      rowKey: 'configMerchantSettleIdString',
      list: detailList.list,
      btnExtra: (
        <Button className="dkl_green_btn" onClick={() => handleDataSet(1)}>
          新增面积
        </Button>
      ),
      expandable: {
        expandedRowRender: (data) => rowTable(data.merchantSettleObjects, data),
      },
    },
  }[!detailList.list.length ? true : detailList.list[0].type === 'no'];

  return (
    <Modal
      title={`平台服务费 - ${record.categoryName}`}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <DataTableBlock
        btnExtra={propsItem.btnExtra}
        cRef={childRef}
        CardNone={false}
        loading={loading}
        columns={propsItem.columns}
        rowKey={(row, i) => `${row[propsItem.rowKey] + i}`}
        params={{ categoryId: record.id }}
        dispatchType="sysTradeList/fetchTradePlatformList"
        componentSize="middle"
        expandable={propsItem.expandable}
        list={propsItem.list}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  detailList: sysTradeList.detailList,
  loading: loading.effects['sysTradeList/fetchTradePlatformList'],
}))(TradePlatformDetailList);
