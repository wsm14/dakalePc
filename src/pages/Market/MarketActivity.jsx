import React, { useRef, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { MARKETACTIVITY_STATUS } from '@/common/constant';
import { handleCopyInfo } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import EnrollGoodsModal from './components/MarketActivity/EnrollGoodsModal';
import MarketActivityDrawer from './components/MarketActivity/MarketActivityDrawer';

const MarketActivity = (props) => {
  const { loading, dispatch, marketActivity } = props;
  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleGoods, setVisibleGoods] = useState(false);

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
            ? { true: '（即将开始）', false: '（已开始）' }[moment().isBefore(row.startDate)]
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
      dataIndex: 'id',
      width: 150,
      tips: `1.活动【已开始】不可下架
      2.活动【已有报名商品】不可下架
      3.活动【即将开始】且【无报名商品】可编辑
      4.活动下架后【无上架操作】，若仍要上架需重新发布`,
      render: (val, row) => {
        const { url, activityName, offLineGoodsNum, onLineGoodsNum, startDate } = row;
        return [
          {
            type: 'info',
            click: () => fetchGetDetail(val, 'info'),
          },
          {
            type: 'edit', // 即将开始 无报名商品
            visible: offLineGoodsNum === 0 && onLineGoodsNum === 0 && moment().isBefore(startDate),
            click: () => fetchGetDetail(val, 'edit'),
          },
          {
            type: 'down', // 即将开始 无报名商品
            pop: true,
            popText: '下架后无法重新上架，\n若仍要上架需重新发布',
            visible: offLineGoodsNum === 0 && onLineGoodsNum === 0 && moment().isBefore(startDate),
            click: () => fetchMarketActivityDown(val),
          },
          {
            type: 'enrollGoods',
            click: () => setVisibleGoods({ show: true, id: val, name: activityName }),
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

  // 下架活动
  const fetchMarketActivityDown = (marketingActivityId) => {
    dispatch({
      type: 'marketActivity/fetchMarketActivityDown',
      payload: { marketingActivityId },
      callback: childRef.current.fetchGetData,
    });
  };

  // 详情
  const fetchGetDetail = (marketingActivityId, mode) => {
    dispatch({
      type: 'marketActivity/fetchMarketActivityDetail',
      payload: { marketingActivityId, mode },
      callback: (detail) => {
        setVisible({ show: true, detail, mode });
      },
    });
  };

  const btnList = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisible({ mode: 'add', show: true }),
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
        rowKey={(record) => `${record.id}`}
        dispatchType="marketActivity/fetchGetList"
        {...marketActivity}
      ></TableDataBlock>
      {/* 新增修改详情 */}
      <MarketActivityDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></MarketActivityDrawer>
      {/* 报名商品 */}
      <EnrollGoodsModal
        visible={visibleGoods}
        onClose={() => setVisibleGoods(false)}
      ></EnrollGoodsModal>
    </>
  );
};

export default connect(({ loading, marketActivity }) => ({
  marketActivity: marketActivity.list,
  loading: loading.models.marketActivity,
}))(MarketActivity);
