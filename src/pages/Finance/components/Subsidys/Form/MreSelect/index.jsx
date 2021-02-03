import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import DataTableBlock from '@/components/DataTableBlock';

const MreSelect = ({ visible, keys, onOk, onCancel, subsidyList = [], loading }) => {
  // 选中的店铺
  const [selectMre, setSelectMre] = useState([]);
  const [selectMreKey, setSelectMreKey] = useState([]);

  useEffect(() => {
    visible && setSelectMreKey(keys);
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      label: '地址',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      width: 300,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
    },
  ];

  return (
    <Modal
      title="选择发布店铺"
      destroyOnClose
      maskClosable
      width={950}
      visible={visible}
      onOk={() => {
        onOk({ keys: selectMreKey, list: selectMre });
        onCancel();
      }}
      onCancel={onCancel}
    >
      <DataTableBlock
        noCard={false}
        componentSize="small"
        searchItems={searchItems}
        columns={getColumns}
        loading={loading}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType="businessList/fetchGetList"
        params={{ bankStatus: 3, businessStatus: 1 }}
        rowSelection={{
          preserveSelectedRowKeys: true,
          selectedRowKeys: selectMreKey,
          onChange: (val, list) => {
            setSelectMreKey(val);
            setSelectMre(list);
          },
        }}
        {...subsidyList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ businessList, loading }) => ({
  subsidyList: businessList.subsidyList,
  loading: loading.effects['businessList/fetchGetList'],
}))(MreSelect);
