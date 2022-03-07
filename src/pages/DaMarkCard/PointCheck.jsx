import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import { checkCityName } from '@/utils/utils';
import { MARK_CARD_MAIN_TYPE, MARK_CARD_OPEN_STATE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const PointCheck = (props) => {
  const { pointManageList, loading, dispatch } = props;

  const childRef = useRef();
  const searchItems = [
    {
      label: '点位名称',
      name: 'name',
    },
    {
      label: '归属人手机号',
      name: 'mobile',
    },
    {
      label: '审核类型',
      name: 'type',
      type: 'select',
    },
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '注册手机号',
      name: 'mobile',
    },
    {
      label: '类型',
      name: 'type',
      type: 'select',
    },
  ];
  const getColumns = [
    {
      title: '点位ID',
      fixed: 'left',
      dataIndex: 'hittingMainId',
    },
    {
      title: '点位名称',
      dataIndex: 'name',
    },
    {
      title: '归属人姓名',
      dataIndex: 'name',
    },
    {
      title: '归属人手机号',
      dataIndex: 'name',
    },
    {
      title: '点位地址',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'name',
    },
    {
      title: '申请原因',
      dataIndex: 'name',
    },
    {
      title: '用户昵称',
      dataIndex: 'name',
    },
    {
      title: '注册手机号',
      dataIndex: 'name',
    },
    {
      title: '提交时间',
      dataIndex: 'name',
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'hittingMainId',
      render: (hittingMainId, record) => {
        return [
          {
            type: 'check',
            click: () => fetchCouponDetail(hittingMainId, 'check'),
          },
          {
            type: 'checkDetail',
            click: () => setVisibleModalDrawer({ show: true, detail: record, type: 'checkDetail' }),
          },
        ];
      },
    },
  ];
  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.hittingMainId}`}
        dispatchType="pointManage/fetchGetList"
        {...pointManageList}
      ></TableDataBlock>
    </>
  );
};
export default connect(({ loading }) => ({
  loading: loading.models.pointManage,
}))(PointCheck);
