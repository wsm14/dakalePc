import React from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import UserSelect from '../UserSelect';

const UserSelectShow = ({
  maxLength,
  experLevel,
  showSelect,
  keys = [],
  list = [],
  otherColumns = [],
  onOk,
  loading,
  onCancelShowSelect,
  rowSelection,
  columns,
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
        loading={loading}
        columns={columns || getColumns}
        rowKey={(record) => `${record.userIdString}`}
        rowSelection={
          rowSelection !== undefined
            ? rowSelection
            : {
                fixed: true,
                selectedRowKeys: keys,
                onChange: (val, resultList) => onOk({ list, keys: val, resultList }),
              }
        }
        list={list}
        total={list.length}
      ></TableDataBlock>
      <UserSelect
        maxLength={maxLength}
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
