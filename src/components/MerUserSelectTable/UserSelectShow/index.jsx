import React, { useState } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import UserSelect from '../UserSelect';

const UserSelectShow = ({
  experLevel,
  showSelect,
  keys = [],
  list = [],
  setSelectList,
  otherColumns = [],
  onCancelShowSelect,
}) => {
  const [userList, setUserList] = useState({ keys: [], list: [] }); // 选择后回显的数据

  // table 表头
  const getColumns = [
    {
      title: '昵称',
      dataIndex: 'username',
      width: 200,
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
      title: '注册地',
      dataIndex: 'provinceName',
      render: (val, row) =>
        val ? `${val}/${row.cityName || '--'}/${row.districtName || '--'}` : '--',
    },
    ...otherColumns,
  ];

  return (
    <div style={{ marginBottom: 20 }} key="table">
      <TableDataBlock
        order
        noCard={false}
        size="small"
        columns={getColumns}
        rowKey={(record) => `${record.userIdString}`}
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (val) => setUserList({ list, keys: val }),
        }}
        list={list}
        total={list.length}
      ></TableDataBlock>
      <UserSelect
        keys={userList.keys}
        visible={showSelect}
        userList={userList.list}
        onOk={setUserList}
        onCancel={() => onCancelShowSelect(false)}
      ></UserSelect>
    </div>
  );
};

export default connect(({ baseData }) => ({
  experLevel: baseData.experLevel,
}))(UserSelectShow);
