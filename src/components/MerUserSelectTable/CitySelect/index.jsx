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
const CitySelect = ({
  type = 'select',
  visible,
  keys = [],
  mreList = [],
  onOk,
  onCancel,
  list = [],
  pagination,
  rowKey = 'cityId',
  loading,
}) => {
  const [selectCity, setSelectCity] = useState([]); // 选中的市级代理
  const [selectCityKey, setSelectCityKey] = useState([]);
  useEffect(() => {
    visible && type === 'select' && setSelectMreKey(keys);
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '企业名称',
      name: 'companyName',
    },
    {
      label: '分管城市',
      name: 'cityCode',
      type: 'cascader',
      select: CITYJSON.map((item) => ({
        ...item,
        children: item.children.map((citem) => ({ ...citem, children: undefined })),
      })),
    },
    {
      label: '登录账号',
      name: 'contactMobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      width: 200,
      ellipsis: { lines: 2 },
    },
    {
      title: '分管城市',
      dataIndex: 'agentCityName',
    },
    {
      title: '登录账号',
      dataIndex: 'contactMobile',
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectMreKey,
    getCheckboxProps: ({ bankStatus, businessStatus, status }) => ({
      disabled: !['3'].includes(bankStatus) || businessStatus === '0' || status === '0', // 非激活状态
    }),
    onChange: (val, list) => {
      // 先去重处理 排除重复已选数据
      // 再对 已选的数据mreList和最新数据进行去重处理 获得去重后结果
      const obj = {};
      const newSelectList = [...mreList, ...list]
        .reduce((item, next) => {
          next && obj[next[rowKey]] ? '' : next && (obj[next[rowKey]] = true && item.push(next));
          return item;
        }, [])
        .filter((item) => item && val.includes(item[rowKey]));
      setSelectMreKey(val);
      setSelectMre(newSelectList);
    },
  };

  return (
    <Modal
      title={`${type === 'select' ? '选择发布店铺（未激活，暂停营业，禁用不可选）' : '查看店铺'}`}
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      footer={type === 'select' ? undefined : false}
      okText={`确定（已选${selectMreKey.length}项）`}
      onOk={() => {
        console.log(selectMreKey, selectMre, 'selectMre');
        onOk({ keys: selectMreKey, list: selectMre });
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
        dispatchType="cityCompany/fetchGetList"
        pagination={pagination}
        rowSelection={type === 'select' ? rowSelection : undefined}
        {...list}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ cityCompany, loading }) => ({
  list: cityCompany.list,
  loading: loading.effects['cityCompany/fetchGetList'],
}))(CitySelect);
