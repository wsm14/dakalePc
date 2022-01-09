import React from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

const MarkInfoModal = (props) => {
  const { loading, markInfoList, detail } = props;

  // 搜索参数
  const searchItems = [
    {
      label: '打卡用户',
      name: 'userId',
      type: 'user',
    },
    {
      label: '打卡时间',
      type: 'rangePicker',
      name: 'createTimeBegin',
      end: 'createTimeEnd',
    },
    // {
    //   label: '打卡点位',
    //   name: 'hittingId',
    //   type: 'select',
    // },
    {
      label: '获得奖励',
      name: 'rewardName',
    },
  ];

  // 表头
  const getColumns = [
    {
      title: '打卡用户昵称',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '用户手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '用户豆号',
      align: 'center',
      dataIndex: 'beanCode',
    },
    {
      title: '打卡时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '打卡点位',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '打卡位置',
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: '获得奖励',
      align: 'center',
      dataIndex: 'rewardName',
      render: (val) => (
        <Ellipsis tooltip length={10}>
          {val.split(',').length === 1 ? val : val.split(',').map((item) => `${item},`)}
        </Ellipsis>
      ),
    },
  ];

  return (
    <TableDataBlock
      order
      noCard={false}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.hittingRewardRecordId}`}
      dispatchType="pointManage/fetchListHittingRecordManagement"
      params={{ mainId: detail.hittingMainId }}
      {...markInfoList}
    />
  );
};

export default connect(({ pointManage, loading }) => ({
  markInfoList: pointManage.markInfoList,
  loading: loading.effects['pointManage/fetchListHittingRecordManagement'],
}))(MarkInfoModal);
