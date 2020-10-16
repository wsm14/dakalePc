import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { useLocation } from 'umi';
import { KeepAlive } from 'react-activation';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import classifySet from './components/UserList/ClassifySet';
import ClassifyDetailList from './components/UserList/ClassifyDetailList';

const ExpertSet = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // table 表头
  const getColumns = [
    {
      title: '哒人领域/内容分类',
      fixed: 'left',
      dataIndex: 'domainName',
    },
    {
      title: '话题',
      align: 'center',
      dataIndex: 'parentDomainId',
      render: (val, record) => val != 0 && <a onClick={() => setVisible({ record })}>设置</a>,
    },
    {
      title: '操作',
      dataIndex: 'domainId',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              visible: record.parentDomainId !== 0,
              click: () =>
                handleClassifySet({
                  ...record,
                  parentDomainId: null,
                }),
            },
            {
              type: 'del',
              visible: record.parentDomainId !== 0,
              click: () => fetchClassifyDel({ domainId: val, deleteFlag: 0 }),
            },
            {
              type: 'own',
              visible: record.parentDomainId === 0,
              title: '添加内容分类',
              click: () =>
                handleClassifySet({ parentDomainId: val, domainNameShow: record.domainName }),
            },
          ]}
        />
      ),
    },
  ];

  // 删除
  const fetchClassifyDel = (values) => {
    dispatch({
      type: 'expertSet/fetchClassifyDel',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 新增/修改 领域/内容分类
  const handleClassifySet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: classifySet({ dispatch, childRef, initialValues }),
    });
  };

  useEffect(() => {
    dispatch({
      type: 'expertSet/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <DataTableBlock
        btnExtra={[
          <Button
            className="dkl_green_btn"
            key="2"
            onClick={() => handleClassifySet({ parentDomainId: 0 })}
          >
            新增
          </Button>,
        ]}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.domainId}`}
        dispatchType="expertSet/fetchGetList"
        {...list}
        expandable={{ childrenColumnName: ['domainDTOList'] }}
        pagination={false}
      ></DataTableBlock>
      <ClassifyDetailList visible={visible} setVisible={setVisible}></ClassifyDetailList>
    </>
  );
};

export default connect(({ expertSet, loading }) => ({
  list: expertSet.list,
  loading: loading.effects['expertSet/fetchGetList'],
}))(ExpertSet);
