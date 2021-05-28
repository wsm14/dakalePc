import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal, Button, Table } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import TradePlatformSet from '../Form/TradePlatformSet';

const TradePlatformDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { record = '' } = visible;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false);

  //  新增 修改 type 1 areaAdd 面积新增 2 areaEdit 面积修改 3 moneySet 服务费新增修改
  const handleDataSet = (type, detail, configMerchantSettleId, rowData) =>
    setVisibleSet({ show: true, type, detail, configMerchantSettleId, rowData });

  // 删除面积
  const fetchDataDel = (value) => {
    dispatch({
      type: 'sysTradeList/fetchTradePlatformSet',
      payload: { configMerchantSettleId: value, deleteFlag: 0 },
      callback: childRef.current.fetchGetData,
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
      callback: childRef.current.fetchGetData,
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
        render: (val, row) => (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () => handleDataSet('moneySet', row, '', data),
              },
              {
                type: 'del',
                click: () => fetchDataRowDel(row, data),
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
      size="middle"
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
              auth: true,
              title: '新增服务费',
              click: () => handleDataSet('moneySet', '', val, red),
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
                handleDataSet('areaEdit', { areaMin: areaArr[0], areaMax: areaArr[1] }, val);
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
          onClick={() => handleDataSet('moneySet', '', 999, detailList.list[0])}
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
        <Button className="dkl_green_btn" onClick={() => handleDataSet('areaAdd')}>
          新增面积
        </Button>
      ),
      expandable: {
        expandedRowRender: (data) => rowTable(data.merchantSettleObjects, data),
      },
    },
  }[!detailList.list.length ? true : detailList.list[0].type === 'no'];

  return (
    <>
      <Modal
        title={`平台服务费 - ${record.categoryName}`}
        width={1150}
        destroyOnClose
        footer={null}
        zIndex={555}
        visible={visible}
        onCancel={() => setVisible('')}
      >
        <TableDataBlock
          btnExtra={propsItem.btnExtra}
          cRef={childRef}
          noCard={false}
          loading={loading}
          columns={propsItem.columns}
          rowKey={(row, i) => `${row[propsItem.rowKey] + i}`}
          params={{ categoryId: record.id }}
          dispatchType="sysTradeList/fetchTradePlatformList"
          size="middle"
          expandable={propsItem.expandable}
          list={propsItem.list}
        ></TableDataBlock>
      </Modal>
      <TradePlatformSet
        childRef={childRef}
        categoryId={record.id}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
      ></TradePlatformSet>
    </>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  detailList: sysTradeList.platFormList,
  loading: loading.effects['sysTradeList/fetchTradePlatformList'],
}))(TradePlatformDetailList);
