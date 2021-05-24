import React, { useRef, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

const MreSelect = ({
  type = 'select',
  visible,
  keys = [],
  onOk,
  onCancel,
  userList = [],
  tableList = [],
  dispatchType = 'userList/fetchGetList',
  params = {},
  loading,
  experLevel,
}) => {
  const childRef = useRef(); // 表格ref
  const [selectUser, setSelectUser] = useState([]); // 选中的店铺
  const [selectKey, setSelectKey] = useState([]);

  useEffect(() => {
    visible && type === 'select' && setSelectKey(keys);
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '用户豆号',
      name: 'beanCode',
    },
    {
      label: '用户手机号',
      name: 'mobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '昵称',
      dataIndex: 'username',
      render: (val) => (
        <Ellipsis length={10} tooltip lines={2}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      render: (val) => experLevel[val],
    },
    {
      title: '豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      render: (val) => val || '小程序用户',
    },
    {
      title: 'ID',
      dataIndex: 'userIdString',
    },
    {
      title: '注册地',
      dataIndex: 'provinceName',
      render: (val, row) =>
        val ? `${val}/${row.cityName || '--'}/${row.districtName || '--'}` : '--',
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectKey,
    onChange: (val, list) => {
      // 先去重处理 排除重复已选数据
      // 再对 已选的数据mreList和最新数据进行去重处理 获得去重后结果
      const obj = {};
      const newSelectList = [...userList, ...list]
        .reduce((item, next) => {
          next && obj[next.userIdString]
            ? ''
            : next && (obj[next.userIdString] = true && item.push(next));
          return item;
        }, [])
        .filter((item) => item && val.includes(item.userIdString));

      setSelectKey(val);
      setSelectUser(newSelectList);
    },
  };

  return (
    <Modal
      title={`${type === 'select' ? '选择用户' : '查看用户'}`}
      destroyOnClose
      maskClosable
      width={1100}
      visible={visible}
      footer={type === 'select' ? undefined : false}
      okText={`确定（已选${selectKey.length}项）`}
      onOk={() => {
        onOk({ keys: selectKey, list: selectUser, resultList: selectUser });
        onCancel();
      }}
      onCancel={onCancel}
    >
      <TableDataBlock
        order
        noCard={false}
        size="middle"
        tableSize="small"
        cRef={childRef}
        searchItems={searchItems}
        columns={getColumns}
        loading={loading.effects['userList/fetchGetList']}
        rowKey={(record) => `${record.userIdString}`}
        dispatchType={dispatchType}
        params={{ ...params }}
        rowSelection={type === 'select' ? rowSelection : undefined}
        {...tableList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ userList, baseData, loading }) => ({
  tableList: userList.list,
  experLevel: baseData.experLevel,
  loading,
}))(MreSelect);
