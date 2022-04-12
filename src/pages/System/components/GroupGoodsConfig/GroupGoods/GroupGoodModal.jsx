import React, { useState, useRef } from 'react';
import { notification } from 'antd';
import { connect } from 'umi';
import { Modal, Button, Form, Empty } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';

const GroupGoodModal = ({ visible = {}, onClose, dispatch, childRef, loading }) => {
  const { show = false } = visible;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [list, setList] = useState([]);

  // 保存
  const handleConfirm = () => {
    if (selectedRowKeys.length) {
      dispatch({
        type: 'groupGoods/fetchSaveTogetherGroupConfig',
        payload: {
          togetherGroupConfigList: selectedRowKeys.map((item) => ({
            goodsId: item,
          })),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    } else {
      onClose();
    }
  };

  const handleSearch = ({ activityName, activityId }) => {
    setList([]);
    if (activityName || activityId) {
      dispatch({
        type: 'groupGoods/fetchListActivityForSearch',
        payload: {
          activityName,
          activityId,
          activityType: 'commerceGoods',
        },
        callback: (list) => {
          setList(list);
        },
      });
    } else {
      notification.warning({
        message: '温馨提示',
        description: '清先搜索',
      });
      return;
    }
  };

  const modalProps = {
    title: '新增商品',
    visible: show,
    width: 1000,
    destroyOnClose: true,
    afterClose: () => setList([]),
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
      width: 350,
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
              商品ID： {row.specialGoodsId}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '商品价格',
      dataIndex: 'realPrice',
      align: 'center',
      render: (val, row) => `￥${val}`,
    },
    {
      title: '库存',
      dataIndex: 'remain',
      align: 'center',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <Modal {...modalProps}>
      <TableDataBlock
        noCard={false}
        columns={getColumns}
        searchItems={searchItems}
        searchCallback={(val) => handleSearch(val)}
        params={{ activityType: 'commerceGoods' }}
        locale={{
          emptyText: <Empty description={<div style={{ fontSize: 20 }}>请先搜索</div>}></Empty>,
        }}
        rowSelection={rowSelection}
        loading={loading}
        rowKey={(record) => `${record.specialGoodsId}`}
        list={list}
        pagination={false}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['groupGoods/fetchListActivityForSearch'],
}))(GroupGoodModal);
