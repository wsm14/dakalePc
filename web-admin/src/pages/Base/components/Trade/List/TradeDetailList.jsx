import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import TradeBaseSet from '../Form/TradeBaseSet';

const TradeBaseList = (props) => {
  const { detailList, loading, visible, onClose, dispatch } = props;

  const { type = 'base', record = '' } = visible;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false);

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
      callback: childRef.current.fetchGetData,
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
          type: 'handle',
          dataIndex: 'value',
          render: (val) => [
            {
              type: 'edit',
              click: () => handleDataSet({ name: val }),
            },
            {
              type: 'del',
              click: () => fetchDataDel(val),
            },
          ],
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
          type: 'handle',
          dataIndex: 'value',
          render: (val) => [
            {
              type: 'edit',
              click: () => handleDataSet({ name: val }),
            },
            {
              type: 'del',
              click: () => fetchDataDel(val),
            },
          ],
        },
      ],
    },
  }[type];

  const handleDataSet = (detail) => setVisibleSet({ show: true, detail });

  return (
    <>
      <Modal
        title={propItem.title}
        width={1150}
        destroyOnClose
        footer={null}
        visible={visible}
        zIndex={555}
        onCancel={() => onClose('')}
      >
        <TableDataBlock
          cRef={childRef}
          noCard={false}
          loading={loading}
          columns={propItem.getColumns}
          rowKey={(row) => `${row[propItem.rowKey]}`}
          btnExtra={[{ onClick: () => handleDataSet() }]}
          params={{ type, categoryId: record.categoryIdString }}
          dispatchType="sysTradeList/fetchDetailList"
          size="middle"
          {...detailList}
        ></TableDataBlock>
      </Modal>
      <TradeBaseSet
        type={type}
        childRef={childRef}
        categoryId={record.categoryIdString}
        visible={visibleSet}
        detailList={detailList}
        onClose={() => setVisibleSet(false)}
      ></TradeBaseSet>
    </>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  detailList: sysTradeList.detailList,
  loading: loading.effects['sysTradeList/fetchDetailList'],
}))(TradeBaseList);
