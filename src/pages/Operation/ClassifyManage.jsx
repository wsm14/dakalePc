import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import debounce from 'lodash/debounce';
import AuthConsumer from '@/layouts/AuthConsumer';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import ClassifySet from './components/Classify/ClassifySet';

const ClassifyManageComponent = (props) => {
  const { classifyManage, loadings, loading, dispatch } = props;

  const childRef = useRef();
  const { mreSelect } = classifyManage;
  const [visible, setVisible] = useState(false);

  // 搜索店铺
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
      align: 'right',
      dataIndex: 'categoryCustomId',
      render: (categoryCustomId, record) => {
        const { merchantIdStr } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () => setVisible({ type: 'edit', detail: record }),
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
    <>
      <DataTableBlock
        btnExtra={
          <AuthConsumer auth="save">
            <Button className="dkl_green_btn" onClick={() => setVisible({ type: 'add' })}>
              新增分类
            </Button>
          </AuthConsumer>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.categoryCustomId}`}
        dispatchType="classifyManage/fetchGetList"
        {...classifyManage}
      ></DataTableBlock>
      <ClassifySet
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></ClassifySet>
    </>
  );
};

export default connect(({ classifyManage, loading }) => ({
  classifyManage,
  loadings: loading,
  loading: loading.effects['classifyManage/fetchGetList'],
}))(ClassifyManageComponent);
