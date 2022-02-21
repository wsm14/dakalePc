import React from 'react';
import TableDataBlock from '@/components/TableDataBlock';

const PartnerSelectShow = ({
  keys = [],
  rowKey = 'partnerId',
  list = [],
  columns,
  setMreList,
  otherColumns = [],
  disabled = false,
  rowSelection,
}) => {
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
                onChange: (val) => setMreList({ list, keys: val }),
              }
        }
        list={list}
        total={list.length}
      ></TableDataBlock>
    </div>
  );
};

export default PartnerSelectShow;
