import React, { useRef } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import tradeBaseSet from './TradeBaseSet';

const TradeBaseSet = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { type = 'base', record = '' } = visible;

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
        categoryId: record.categoryIdString,
        CeditType: type,
      }),
    });
  };

  // 删除参数
  const fetchDataDel = (value) => {
    dispatch({
      type: propItem.setUrl,
      payload: {
        [propItem.keyName]: detailList.list
          .map((item) => item.name)
          .filter((item) => item != value),
        categoryId: record.categoryIdString,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // table
  const propItem = {
    base: {
      title: `基础设施`,
      rowKey: 'name',
      keyName: 'infrastructures',
      setUrl: 'sysTradeList/fetchTradeBaseSet',
      getColumns: [
        {
          title: '设施',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'value',
          render: (val) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  click: () => handleDataSet({ name: val }),
                },
                {
                  type: 'del',
                  click: () => fetchDataDel(val),
                },
              ]}
            />
          ),
        },
      ],
    },
    special: {
      title: `特色服务`,
      rowKey: 'name',
      keyName: 'specialService',
      setUrl: 'sysTradeList/fetchTradeSpecialSet',
      getColumns: [
        {
          title: '特色服务',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'value',
          render: (val, record) => (
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  click: () => handleDataSet({ name: val }),
                },
                {
                  type: 'del',
                  click: () => fetchDataDel(val),
                },
              ]}
            />
          ),
        },
      ],
    },
  }[type];

  return (
    <Modal
      title={propItem.title}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <DataTableBlock
        btnExtra={
          <Button className="dkl_green_btn" onClick={() => handleDataSet()}>
            新增
          </Button>
        }
        cRef={childRef}
        CardNone={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row) => `${row[propItem.rowKey]}`}
        params={{ type, categoryId: record.categoryIdString }}
        dispatchType="sysTradeList/fetchDetailList"
        componentSize="middle"
        {...detailList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  detailList: sysTradeList.detailList,
  loading: loading.effects['sysTradeList/fetchDetailList'],
}))(TradeBaseSet);
