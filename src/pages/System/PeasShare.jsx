import React, { useRef } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import peasShareSet from './components/PeasShare/PeasShareSet';

const SysPeasShare = (props) => {
  const { sysPeasShare, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '观看时长',
      dataIndex: 'watchTime',
      render: (val) => `${val}秒`,
    },
    {
      title: '最低卡豆数',
      align: 'center',
      dataIndex: 'limitBean',
    },
    {
      title: '操作',
      dataIndex: 'configMomentIdString',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => handlePeasShareSet(record),
            },
            {
              type: 'del',
              click: () => fetchPeasShareDel(val),
            },
          ]}
        />
      ),
    },
  ];

  // 删除
  const fetchPeasShareDel = (val) => {
    dispatch({
      type: 'sysPeasShare/fetchPeasShareEdit',
      payload: { configMomentId: val, deleteFlag: 0 },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 新增 修改
  const handlePeasShareSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: peasShareSet({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <TableDataBlock
      cRef={childRef}
      btnExtra={
        <AuthConsumer auth="save">
          <Button className="dkl_green_btn" onClick={() => handlePeasShareSet()}>
            新增
          </Button>
        </AuthConsumer>
      }
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.configMomentIdString}`}
      dispatchType="sysPeasShare/fetchGetList"
      {...sysPeasShare}
    ></TableDataBlock>
  );
};

export default connect(({ sysPeasShare, loading }) => ({
  sysPeasShare,
  loading: loading.models.sysPeasShare,
}))(SysPeasShare);
