import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import TradeSceneSet from '../Form/TradeSceneSet';
import PopImgShow from '@/components/PopImgShow';

const TradeSceneList = (props) => {
  const { detailList, loading, visible, onClose, dispatch, childRef } = props;
  const { type = 'scene', record = '' } = visible;

  const [visibleUpdate, setVisibleUpdate] = useState(false);

  const getColumns = [
    { title: '适用场景', align: 'center', dataIndex: 'name' },
    {
      title: '图片',
      align: 'center',
      dataIndex: 'name',
      render: (val) => <PopImgShow url={val} />,
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
              click: () => handleDataSet('edit', record),
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

  //新增/编辑
  const handleDataSet = (type, detail) => {
    setVisibleUpdate({
      show: true,
      type,
      detail,
    });
  };

  //删除
  const fetchDataDel = (val) =>{

  }

  return (
    <Modal
      title="适用场景"
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      zIndex={555}
      onCancel={() => onClose('')}
    >
      <TableDataBlock
        btnExtra={
          <Button className="dkl_green_btn" onClick={() => handleDataSet('add')}>
            新增
          </Button>
        }
        cRef={childRef}
        noCard={false}
        columns={getColumns}
        // rowKey={(row) => ``}
        params={{ categoryId: record.categoryIdString }}
        // dispatchType="sysTradeList/fetchDetailList"
        size="middle"
        // {...detailList}
      ></TableDataBlock>
      <TradeSceneSet
        visible={visibleUpdate}
        childRef={childRef}
        onClose={() => setVisibleUpdate(false)}
      ></TradeSceneSet>
    </Modal>
  );
};
export default connect(({ sysTradeList, loading }) => ({
  detailList: sysTradeList.detailList,
  loading: loading,
}))(TradeSceneList);
