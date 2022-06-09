import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import { OPEN_GROUP_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import OpenGroupDetail from './components/OpenGroupList/OpenGroupDetail';

const MarketActivity = (props) => {
  const { loading, dispatch, openGroupList } = props;
  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  const searchItems = [
    {
      label: '活动名称',
      name: 'goodsName',
    },
    {
      label: '活动编号',
      name: 'groupId',
    },
    {
      label: '活动状态',
      type: 'select',
      name: 'status',
      select: OPEN_GROUP_STATUS,
    },
  ];

  const getColumns = [
    {
      title: '活动名称/编号',
      fixed: 'left',
      dataIndex: 'groupId',
      width: 300,
      render: (val, row) => `本地品本地品本地品本地品本地品\n32413215425234`,
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'togetherEarnGoodsObject',
      render: (val, row) => `2020.05.01 - 2020.05.30`,
    },
    {
      title: '报名商品数',
      align: 'center',
      dataIndex: 'username',
      render: (val, row) => `本地品 30\n电商品 20`,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `活动中 30\n${moment().isBefore("20220610")}`,
    },
    {
      title: '最后修改',
      align: 'center',
      dataIndex: 'joinUserNum',
      render: (val, row) => `2021-04-22 12:32:32\n电商品 20`,
    },
    {
      type: 'handle',
      dataIndex: 'groupId',
      width: 150,
      render: (val, record) => {
        return [
          {
            type: 'info',
            title: '拼团详情',
            click: () => fetchDetail(val),
          },
          {
            type: 'immediateGroup',
            title: '立即成团',
            pop: true,
            popText: '确定要立即成团吗？立即成团后将在已参与的用户中随机抽取3位用户拼中商品。',
            visible: record.joinUserNum >= 8 && record.status == '0', //拼团中并且参团人数大于等于8人
            click: () => fetchGetGroup(val),
          },
        ];
      },
    },
  ];

  //立即成团
  const fetchGetGroup = (groupId) => {
    dispatch({
      type: 'openGroupList/fetchSimulationStartGroup',
      payload: {
        groupId,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  //参团详情
  const fetchDetail = (groupId) => {
    dispatch({
      type: 'openGroupList/fetchAdminListJoinGroupByGroupId',
      payload: {
        groupId,
      },
      callback: (list) => {
        setVisible({
          show: true,
          list,
        });
      },
    });
  };

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.groupId}`}
        timeParams={{
          time: {
            startTime: moment().subtract(1, 'month').format('YYYY-MM-DD'),
            endTime: moment().format('YYYY-MM-DD'),
          },
          show: {
            startTime: [moment().subtract(1, 'month'), moment()],
          },
        }}
        dispatchType="openGroupList/fetchGetList"
        {...openGroupList}
      ></TableDataBlock>
      <OpenGroupDetail visible={visible} onClose={() => setVisible(false)}></OpenGroupDetail>
    </>
  );
};

export default connect(({ loading, openGroupList }) => ({
  openGroupList,
  loading: loading.models.openGroupList,
}))(MarketActivity);
