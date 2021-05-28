import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { EXPERT_SORT_TYPE } from '@/common/constant';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import SortSet from './components/Sort/SortSet';

const ExpertSort = (props) => {
  const { expertSort, loading } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '排序维度',
      dataIndex: 'keyName',
      render: (val) => EXPERT_SORT_TYPE[val],
    },
    {
      title: '数值',
      align: 'right',
      dataIndex: 'value',
    },
    {
      title: '操作',
      dataIndex: 'key',
      align: 'right',
      render: (key, record) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () => handleSortSet({ key, value: record.value }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 修改
  const handleSortSet = (initialValues) => setVisible({ show: true, initialValues });

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.key}`}
        dispatchType="expertSort/fetchGetList"
        {...expertSort}
        pagination={false}
      ></TableDataBlock>
      <SortSet visible={visible} childRef={childRef} onClose={() => setVisible(false)}></SortSet>
    </>
  );
};

export default connect(({ expertSort, loading }) => ({
  expertSort,
  loading: loading.models.expertSort,
}))(ExpertSort);
