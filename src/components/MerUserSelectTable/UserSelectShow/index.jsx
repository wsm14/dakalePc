import React from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import UserSelect from '../UserSelect';

const UserSelectShow = ({
  experLevel,
  showSelect,
  keys = [],
  list = [],
  otherColumns = [],
  onOk,
  onCancelShowSelect,
}) => {
  // table 表头
  const getColumns = [
    {
      title: '昵称',
      dataIndex: 'username',
      ellipsis: true,
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
        noCard={false}
        size="small"
        columns={getColumns}
        rowKey={(record) => `${record.userIdString}`}
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (val, resultList) => onOk({ list, keys: val, resultList }),
        }}
        list={list}
        total={list.length}
      ></TableDataBlock>
      <UserSelect
        keys={keys}
        visible={showSelect}
        userList={list}
        onOk={onOk}
        onCancel={() => onCancelShowSelect(false)}
      ></UserSelect>
    </div>
  );
};

export default connect(({ baseData }) => ({
  experLevel: baseData.experLevel,
}))(UserSelectShow);
