import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import CITYJSON from '@/common/city';
import TableDataBlock from '@/components/TableDataBlock';

/**
 *
 * @param {Object} list 渲染的数组 { list:[], total:0 }
 * @returns
 */
const PartnerSelect = ({
  visible,
  keys = [],
  partnerList = [],
  onOk,
  onCancel,
  list = [],
  rowKey = 'partnerId',
  loading,
}) => {
  const [selectCity, setSelectCity] = useState([]); // 选中的市级代理
  const [selectCityKey, setSelectCityKey] = useState([]);
  useEffect(() => {
    visible && setSelectCityKey(keys);
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '企业名称',
      name: 'partnerName',
    },
    {
      label: '分管区县',
      name: 'districtCode',
      type: 'cascader',
      select: CITYJSON,
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '企业名称',
      dataIndex: 'partnerName',
      width: 200,
      ellipsis: { lines: 2 },
    },
    {
      title: '分管区县',
      dataIndex: 'agentDistrictName',
    },
    {
      title: '登录账号',
      dataIndex: 'account',
    },
    {
      title: '联系人电话',
      dataIndex: 'contactMobile',
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectCityKey,
    getCheckboxProps: ({ partnerStatus }) => ({
      disabled: ['1', '2'].includes(partnerStatus),
    }),
    onChange: (val, list) => {
      // 先去重处理 排除重复已选数据
      // 再对 已选的数据mreList和最新数据进行去重处理 获得去重后结果
      const obj = {};
      const newSelectList = [...partnerList, ...list]
        .reduce((item, next) => {
          next && obj[next[rowKey]] ? '' : next && (obj[next[rowKey]] = true && item.push(next));
          return item;
        }, [])
        .filter((item) => item && val.includes(item[rowKey]));
      setSelectCityKey(val);
      setSelectCity(newSelectList);
    },
  };

  return (
    <Modal
      title={'选择区县代理（已解约、已冻结状态不可选）'}
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      okText={`确定（已选${selectCityKey.length}项）`}
      onOk={() => {
        console.log(selectCityKey, selectCity, 'selectCity');
        onOk({ keys: selectCityKey, list: selectCity });
        onCancel();
      }}
      onCancel={onCancel}
    >
      <TableDataBlock
        order
        noCard={false}
        size="middle"
        tableSize="small"
        columns={getColumns}
        loading={loading}
        searchItems={searchItems}
        rowKey={(record) => `${record[rowKey]}`}
        dispatchType="areaCenter/fetchGetList"
        rowSelection={rowSelection}
        {...list}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ areaCenter, loading }) => ({
  list: areaCenter.list,
  loading: loading.effects['areaCenter/fetchGetList'],
}))(PartnerSelect);
