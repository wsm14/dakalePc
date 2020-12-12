import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import SearchSetModal from './components/SearchSet/SearchSetModal';

const SearchSetList = (props) => {
  const { loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({ show: false, detail: [],data:{} });

  // 回显信息
  const fetchSearchGetData = () => {
    dispatch({
      type: 'searchSet/fetchSearchGetData',
      callback: (detail) => setVisible({ show: true, detail,data:{data: detail.map(i=>i.value)} }),
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '配置类型',
      fixed: 'left',
      dataIndex: 'title',
    },
    {
      title: '操作',
      dataIndex: 'key',
      align: 'right',
      fixed: 'right',
      render: (val) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '配置',
              click: fetchSearchGetData,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.title}`}
        list={[{ title: '热门搜索' }]}
      ></DataTableBlock>
      <SearchSetModal
        visible={visible}
        onCancel={() => setVisible({ show: false })}
      ></SearchSetModal>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.searchSet,
}))(SearchSetList);
