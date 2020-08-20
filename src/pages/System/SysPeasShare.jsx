import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import peasShareSet from './components/PeasShare/PeasShareSet';

const SysPeasShare = (props) => {
  const { sysPeasShare, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '观看时长',
      dataIndex: 'userId',
    },
    {
      title: '最低卡豆数',
      align: 'center',
      dataIndex: 'phoneNumber',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => fetchBannerDetail(record),
            },
            {
              type: 'del',
              click: () => fetchPeasShareDel(record),
            },
          ]}
        />
      ),
    },
  ];

  // 获取详情
  const fetchBannerDetail = (payload) => {
    dispatch({
      type: 'sysPeasShare/fetchBannerDetail',
      payload,
      callback: (info) => handlePeasShareSet(info),
    });
  };

  // 删除
  const fetchPeasShareDel = (payload) => {
    dispatch({
      type: 'sysPeasShare/fetchPeasShareDel',
      payload,
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
    <DataTableBlock
      cRef={childRef}
      btnExtra={
        <Button className="dkl_green_btn" onClick={() => handlePeasShareSet()}>
          新增
        </Button>
      }
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.userId}`}
      dispatchType="sysPeasShare/fetchGetList"
      {...sysPeasShare}
    ></DataTableBlock>
  );
};

export default connect(({ sysPeasShare, loading }) => ({
  sysPeasShare,
  loading: loading.models.sysPeasShare,
}))(SysPeasShare);
