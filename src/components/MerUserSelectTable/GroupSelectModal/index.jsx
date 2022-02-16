import React, { useRef, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import Search from './Search';

/**
 *
 * @param {Object} list 渲染的数组 { list:[], total:0 }
 * @returns
 */
const GroupSelect = ({
  type = 'select',
  visible,
  keys = [],
  groupList = [],
  onOk,
  onCancel,
  searchShow = true,
  columns = null,
  subsidyList = [],
  dispatchType = 'groupSet/fetchGetList',
  params = {},
  list = null,
  rowKey = 'merchantGroupIdString',
  loading,
}) => {
  const childRef = useRef(); // 表格ref
  const [selectMreGroup, setSelectMreGroup] = useState([]); // 选中的店铺
  const [selectGroupKey, setSelectGroupKey] = useState([]);
  useEffect(() => {
    visible && type === 'select' && setSelectGroupKey(keys);
  }, [visible]);

  // table 表头
  const getColumns = [
    {
      title: '集团名称',
      dataIndex: 'groupName',
      ellipsis: true,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
    },
    {
      title: '经营类目',
      dataIndex: 'topCategoryName',
    },
    {
      title: '地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      ellipsis: true,
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectGroupKey,
    getCheckboxProps: ({ bankStatus }) => ({
      disabled: !['3'].includes(bankStatus), // 非激活状态
    }),
    onChange: (val, list) => {
      // 先去重处理 排除重复已选数据
      // 再对 已选的数据和最新数据进行去重处理 获得去重后结果
      const obj = {};
      const newSelectList = [...groupList, ...list]
        .reduce((item, next) => {
          next && obj[next[rowKey]] ? '' : next && (obj[next[rowKey]] = true && item.push(next));
          return item;
        }, [])
        .filter((item) => item && val.includes(item[rowKey]));
      setSelectGroupKey(val);
      setSelectMreGroup(newSelectList);
    },
  };

  return (
    <Modal
      title={`${type === 'select' ? '选择发布集团' : '查看集团'}`}
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      footer={type === 'select' ? undefined : false}
      okText={`确定（已选${selectGroupKey.length}项）`}
      onOk={() => {
        onOk({ keys: selectGroupKey, list: selectMreGroup });
        onCancel();
      }}
      onCancel={onCancel}
    >
      {searchShow && <Search cRef={childRef}></Search>}
      <TableDataBlock
        order
        noCard={false}
        size="middle"
        tableSize="small"
        cRef={childRef}
        columns={columns ? columns : getColumns}
        loading={loading.effects[dispatchType]}
        rowKey={(record) => `${record[rowKey]}`}
        dispatchType={dispatchType}
        params={{ ...params, bankStatus: 3, businessStatus: 1 }}
        rowSelection={type === 'select' ? rowSelection : undefined}
        {...(list ? list : subsidyList)}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ groupSet, loading }) => ({
  subsidyList: groupSet.list,
  loading,
}))(GroupSelect);
