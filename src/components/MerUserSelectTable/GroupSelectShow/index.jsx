import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';
import { checkCityName } from '@/utils/utils';

const GroupSelectShow = ({
  keys = [],
  rowKey = 'merchantGroupIdString',
  list = [],
  columns,
  setGroupList,
  otherColumns = [],
  disabled = false,
  rowSelection,
}) => {
  // table 表头
  const getColumns = [
    {
      title: '集团名称',
      dataIndex: 'groupName',
      width: 200,
      ellipsis: { lines: 2 },
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
      width: 200,
      ellipsis: { lines: 2 },
    },
    ...otherColumns,
  ];

  return (
    <div style={{ marginBottom: 20 }} key="table">
      <TableDataBlock
        noCard={false}
        size="small"
        columns={columns || getColumns}
        rowKey={(record) => `${record[rowKey]}`}
        rowSelection={
          rowSelection !== undefined
            ? rowSelection
            : {
                fixed: true,
                selectedRowKeys: keys,
                getCheckboxProps: (record) => ({
                  disabled: disabled, // Column configuration not to be checked
                }),
                onChange: (val) => setGroupList({ list, keys: val }),
              }
        }
        list={list}
        total={list.length}
      ></TableDataBlock>
    </div>
  );
};

export default GroupSelectShow;
