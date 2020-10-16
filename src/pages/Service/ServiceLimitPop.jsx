import React, { useRef } from 'react';
import { connect } from 'dva';
import { useLocation } from 'umi';
import { KeepAlive } from 'react-activation';
import { Button } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';
import limitPopSet from './components/LimitPop/LimitPopSet';

const ServiceLimitPop = (props) => {
  const { serviceLimitPop, loading, dispatch } = props;

  const match = useLocation();
  const childRef = useRef();
  // 搜索参数
  const searchItems = [
    {
      label: '姓名',
      name: 'name',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '增加时间',
      align: 'center',
      dataIndex: 'createTimeString',
    },
  ];

  // 新增
  const handLimitPopSet = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: limitPopSet({ dispatch, childRef }),
    });
  };

  return (
    <>
      <DataTableBlock
        btnExtra={
          <Button className="dkl_green_btn" key="1" onClick={handLimitPopSet}>
            新增
          </Button>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.mobile}`}
        dispatchType="serviceLimitPop/fetchGetList"
        {...serviceLimitPop}
      ></DataTableBlock>
    </>
  );
};

export default connect(({ serviceLimitPop, loading }) => ({
  serviceLimitPop,
  loading: loading.models.serviceLimitPop,
}))(ServiceLimitPop);
