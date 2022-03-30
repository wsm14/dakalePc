import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Modal, Button, Form, Empty } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';

const GroupGoodModal = ({
  visible = {},
  onClose,
  dispatch,
  childRef,
  loading,
  activityGoodsList = [],
}) => {
  const { show = false } = visible;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const cRef = useRef();

  // 保存
  const handleConfirm = () => {
    dispatch({
      type: 'groupGoods/fetchSaveTogetherGroupConfig',
      payload: {
        togetherGroupConfigList: selectedRowKeys.map((item) => ({
          goodsId: item,
        })),
      },
      callback: () => {
        childRef.current.fetchGetData();
        onClose();
      },
    });
  };

  const handleSearch = ({ activityName, activityId }) => {
    if (activityName || activityId) {
      dispatch({
        type: 'groupGoods/fetchListActivityForSearch',
        payload: {
          activityName,
          activityId,
          activityType: 'commerceGoods',
        },
      });
      // cRef.current.fetchGetData();
    }
  };

  const modalProps = {
    title: ' 新增商品',
    visible: show,
    width: 1000,
    onCancel: onClose,
    onOk: handleConfirm,
  };

  const searchItems = [
    {
      label: '商品名称',
      name: 'activityName',
    },
    {
      label: '商品ID',
      name: 'activityId',
      // type: 'merchant',
    },
  ];
  const getColumns = [
    {
      title: '商品名称',
      fixed: 'left',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5, color: '#999' }}>
              商品ID： {row.goodsIdString}
            </div>
          </div>
        </div>
      ),
    },
    { title: '商品价格', dataIndex: 'goodsImg', align: 'center' },
    { title: '库存', dataIndex: 'goodsImg', align: 'center' },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  return (
    <Modal {...modalProps}>
      <TableDataBlock
        noCard={false}
        cRef={cRef}
        columns={getColumns}
        searchItems={searchItems}
        searchCallback={(val) => handleSearch(val)}
        params={{ activityType: 'commerceGoods' }}
        rowSelection={rowSelection}
        loading={loading}
        rowKey={(record) => `${record.specialGoodsId}`}
        list={activityGoodsList}
        pagination={false}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ loading, groupGoods }) => ({
  activityGoodsList: groupGoods.activityGoodsList,
  loading: loading.effects['groupGoods/fetchListActivityForSearch'],
}))(GroupGoodModal);
