import React, { useRef } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';

const ClassifyManageComponent = (props) => {
  const { classifyManage, loadings, loading, dispatch } = props;

  const childRef = useRef();
  const { mreSelect } = classifyManage;

  // 搜索用户
  const fetchClassifyGetMre = debounce((keyword) => {
    if (!keyword) return;
    dispatch({
      type: 'classifyManage/fetchClassifyGetMre',
      payload: {
        limit: 999,
        page: 1,
        keyword,
      },
    });
  }, 500);

  // 分类删除
  const fetchClassifyDel = (payload) => {
    dispatch({
      type: 'classifyManage/fetchClassifyDel',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '所属店铺',
      name: 'merchantId',
      type: 'select',
      loading: loadings.effects['classifyManage/fetchClassifyGetMre'],
      allItem: false,
      onSearch: (val) => fetchClassifyGetMre(val),
      select: { list: mreSelect },
      placeholder: '请输入搜索',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      dataIndex: 'sortValue',
      render: (val, item, i) => i + 1,
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      render: (val) => val || '--',
    },
    {
      title: '所属店铺',
      dataIndex: 'merchantName',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      dataIndex: 'categoryCustomId',
      render: (categoryCustomId, record) => {
        const { merchantIdStr } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () =>
                  fetchGetDetail(val, (info) => setVisibleEdit({ show: true, type: 'edit', info })),
              },
              {
                type: 'del',
                popText: (
                  <div>
                    删除后，该数据将无法恢复<div>确定要删除吗？</div>
                  </div>
                ),
                click: () => fetchClassifyDel({ categoryCustomId, merchantIdStr }),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.categoryCustomId}`}
      dispatchType="classifyManage/fetchGetList"
      {...classifyManage}
    ></DataTableBlock>
  );
};

export default connect(({ classifyManage, loading }) => ({
  classifyManage,
  loadings: loading,
  loading: loading.effects['classifyManage/fetchGetList'],
}))(ClassifyManageComponent);
