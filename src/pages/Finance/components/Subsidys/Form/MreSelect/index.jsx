import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import DataTableBlock from '@/components/DataTableBlock';

const MreSelect = ({ visible, keys, mreList = [], onOk, onCancel, subsidyList = [], loading }) => {
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
      okText={`确定（已选${selectMreKey.length}项）`}
      onOk={() => {
        onOk({ keys: selectMreKey, list: selectMre });
        onCancel();
      }}
      onCancel={onCancel}
    >
      <DataTableBlock
        noCard={false}
        componentSize="middle"
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
            // 先去重处理 排除重复已选数据
            // 再对 已选的数据mreList和最新数据进行去重处理 获得去重后结果
            const obj = {};
            const newSelectList = [...mreList, ...list]
              .reduce((item, next) => {
                next && obj[next.userMerchantIdString]
                  ? ''
                  : next && (obj[next.userMerchantIdString] = true && item.push(next));
                return item;
              }, [])
              .filter((item) => item && val.includes(item.userMerchantIdString));
            setSelectMreKey(val);
            setSelectMre(newSelectList);
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
