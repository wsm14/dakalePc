import React, { useRef } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import TableDataBlock from '@/components/TableDataBlock';
import limitPopSet from './components/LimitPop/LimitPopSet';

const ServiceLimitPop = (props) => {
  const { serviceLimitPop, loading, dispatch } = props;

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
    <TableDataBlock
      btnExtra={
        <AuthConsumer auth="save">
          <Button className="dkl_green_btn" key="1" onClick={handLimitPopSet}>
            新增
          </Button>
        </AuthConsumer>
      }
      keepName
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.mobile}`}
      dispatchType="serviceLimitPop/fetchGetList"
      {...serviceLimitPop}
    ></TableDataBlock>
  );
};

export default connect(({ serviceLimitPop, loading }) => ({
  serviceLimitPop,
  loading: loading.models.serviceLimitPop,
}))(ServiceLimitPop);
