import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import TradeSceneSet from '../Form/TradeSceneSet';
import PopImgShow from '@/components/PopImgShow';

const TradeSceneList = (props) => {
  const {sceneList, loading, visible, onClose, dispatch, childRef } = props;
  const { type = '', record = '' } = visible;
 
  const [visibleUpdate, setVisibleUpdate] = useState(false);

  const getColumns = [
    { title: '适用场景', align: 'center', dataIndex: 'scenesName' },
    {
      title: '图片',
      // align: 'center',
      dataIndex: 'image',
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
              click: () => fetchDataDel(record),
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
  const fetchDataDel = (record) =>{
    const {categoryScenesId,image,scenesName,deleteFlag} = record
    dispatch({
      type:'sysTradeList/fetchSceneUpdate',
      payload:{
        categoryScenesId,
        image,
        scenesName,
        deleteFlag:0
      },
      callback:()=>{
        childRef.current.fetchGetData();
      }
    })

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
        rowKey={(row) => `${row.categoryScenesId}`}
        params={{ categoryId: record.categoryIdString }}
        dispatchType="sysTradeList/fetchSceneListById"
        size="middle"
        {...sceneList}
      ></TableDataBlock>
      <TradeSceneSet
        visible={visibleUpdate}
        childRef={childRef}
        categoryId={record.categoryIdString}
        onClose={() => setVisibleUpdate(false)}
      ></TradeSceneSet>
    </Modal>
  );
};
export default connect(({ sysTradeList, loading }) => ({
  sceneList: sysTradeList.sceneList,
  loading: loading.effects['sysTradeList/fetchSceneListById'],
}))(TradeSceneList);
