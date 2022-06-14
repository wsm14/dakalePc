import React, { useRef, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { MARKETACTIVITY_STATUS } from '@/common/constant';
import { handleCopyInfo } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import MarketActivityDrawer from './components/MarketActivity/MarketActivityDrawer';

const MarketActivity = (props) => {
  const { loading, dispatch, marketActivity } = props;
  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  const searchItems = [
    {
      label: '活动名称',
      name: 'activityName',
    },
    {
      label: '活动编号',
      name: 'marketingActivityId',
    },
    {
      label: '活动状态',
      type: 'select',
      name: 'status',
      select: MARKETACTIVITY_STATUS,
    },
  ];

  const getColumns = [
    {
      title: '活动名称/编号',
      fixed: 'left',
      dataIndex: 'activityName',
      width: 300,
      render: (val, row) => `${val}\n${row.id}`,
    },
    {
      title: '活动时间',
      align: 'right',
      dataIndex: 'startDate',
      render: (val, row) => `${val}\n~${row.endDate}`,
    },
    {
      title: '报名商品数',
      align: 'right',
      dataIndex: 'offLineGoodsNum',
      render: (val, row) =>
        val == 0 && row.onLineGoodsNum == 0 ? '--' : `本地品 ${val}\n电商品 ${row.onLineGoodsNum}`,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) =>
        `${MARKETACTIVITY_STATUS[val]}\n${
          val === '0'
            ? { true: '（即将开会）', false: '（已开始）' }[moment().isBefore(row.startDate)]
            : ''
        }`,
    },
    {
      title: '最后修改',
      align: 'center',
      dataIndex: 'updateTime',
      render: (val, row) => `${val}\n${row.updater}`,
    },
    {
      type: 'handle',
      dataIndex: 'markingActivityId',
      width: 150,
      render: (val, row) => {
        const { url, offLineGoodsNum, onLineGoodsNum, startDate } = row;
        return [
          {
            type: 'info',
            click: () => fetchDetail(val),
          },
          {
            type: 'edit', // 即将开始 无报名商品
            visible: offLineGoodsNum === 0 && onLineGoodsNum === 0 && moment().isBefore(startDate),
            click: () => fetchDetail(val),
          },
          {
            type: 'down', // 即将开始 无报名商品
            pop: true,
            popText: '下架后无法重新上架，若需上架需要重新发布',
            visible: offLineGoodsNum === 0 && onLineGoodsNum === 0 && moment().isBefore(startDate),
            click: () => fetchDetail(val),
          },
          {
            type: 'enrollGoods',
            click: () => handleCopyInfo(url),
          },
          {
            type: 'copyLink',
            visible: !!url,
            click: () => handleCopyInfo(url),
          },
        ];
      },
    },
  ];

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

  const btnList = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisible({ type: 'add', shwo: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={btnList}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.markingActivityId}`}
        dispatchType="marketActivity/fetchGetList"
        {...marketActivity}
      ></TableDataBlock>
      {/* 新增修改详情 */}
      <MarketActivityDrawer
        visible={visible}
        onClose={() => setVisible(false)}
      ></MarketActivityDrawer>
    </>
  );
};

export default connect(({ loading, marketActivity }) => ({
  marketActivity,
  loading: loading.models.marketActivity,
}))(MarketActivity);
