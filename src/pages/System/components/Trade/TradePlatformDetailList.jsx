import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal, Button, Table } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import tradeBaseSet from './TradeBaseSet';

const TradePlatformDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { record = '' } = visible;

  const childRef = useRef();

  //  新增 修改
  const handleDataSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: tradeBaseSet({
        dispatch,
        childRef,
        initialValues,
        detailList,
        categoryId: record.id,
      }),
    });
  };

  // // 删除参数
  // const fetchDataDel = (value) => {
  //   dispatch({
  //     type: propItem.setUrl,
  //     payload: {
  //       [propItem.keyName]: detailList.list
  //         .map((item) => item.name)
  //         .filter((item) => item != value),
  //       categoryId: record.id,
  //     },
  //     callback: () => childRef.current.fetchGetData(),
  //   });
  // };

  const columns = [
    {
      title: '服务费比例',
      align: 'center',
      dataIndex: 'freeBean',
    },
    {
      title: '赠送卡豆',
      align: 'center',
      dataIndex: 'serviceFee',
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
              click: () => handlePeasShareSet(red),
            },
            {
              type: 'del',
              click: () => handlePeasShareSet(red),
            },
          ]}
        />
      ),
    },
  ];

  const rowTable = (data) => (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(row) => `${row.freeBean}`}
      pagination={false}
      componentSize="middle"
    />
  );

  // table
  const getColumns = [
    {
      title: '服务费设置',
      align: 'center',
      dataIndex: 'typeContent',
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'configMerchantSettleIdString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '新增服务费',
              click: () => handlePeasShareSet(record),
            },
            {
              type: 'edit',
              click: () => handlePeasShareSet(record),
            },
            {
              type: 'del',
              click: () => handlePeasShareSet(record),
            },
          ]}
        />
      ),
    },
  ];

  const propsItem = detailList.list[0]
    ? {
        true: {
          columns,
          rowKey: 'freeBean',
          list: detailList.list[0].merchantSettleObjects,
          btnExtra: (
            <Button className="dkl_green_btn" onClick={() => handleDataSet()}>
              新增
            </Button>
          ),
        },
        false: {
          columns: getColumns,
          rowKey: 'configMerchantSettleIdString',
          list: detailList.list,
          btnExtra: (
            <Button className="dkl_green_btn" onClick={() => handleDataSet()}>
              新增面积
            </Button>
          ),
          expandable: { expandedRowRender: (data) => rowTable(data.merchantSettleObjects) },
        },
      }[detailList.list[0].type === 'no']
    : {};

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
        rowKey={(row) => `${row[propsItem.rowKey]}`}
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
