import React, { useRef } from 'react';
import { connect } from 'umi';
import { EXPERT_SORT_TYPE } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import sortSet from './components/Sort/SortSet';

const ExpertSort = (props) => {
  const { expertSort, loading, dispatch } = props;

  const childRef = useRef();

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
  const handleSortSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: sortSet({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.key}`}
      dispatchType="expertSort/fetchGetList"
      {...expertSort}
      pagination={false}
    ></DataTableBlock>
  );
};

export default connect(({ expertSort, loading }) => ({
  expertSort,
  loading: loading.models.expertSort,
}))(ExpertSort);
