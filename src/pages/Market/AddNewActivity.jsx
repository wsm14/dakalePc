import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { ACTIVITY_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import AddNewActivitySet from './components/AddNewActivity/AddNewActivitySet';

const data = {
  list: [
    {
      activityName: '肯德基邀请好友活动',
      activityBeginTime: '2021-10-01',
      activityEndTime: '2021-10-03',
      cityCity: '浙江省-杭州市',
      activityStatus: '1',
      kuCun: '999',
      aaaaa: 'aaaaa',
    },
  ],
  total: 0,
};

// 拉新活动
const AddNewActivity = (props) => {
  const { marketCardActivity, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 新增
  const [params] = useState({});

  // 搜索参数
  const searchItems = [
    {
      label: '活动名称',
      name: 'activityName',
    },
    {
      label: '活动状态',
      name: 'activityStatus',
      type: 'select',
      select: ACTIVITY_STATUS,
    },
    {
      label: '活动城市',
      name: 'activityStatus',
      type: 'select',
      select: ACTIVITY_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '活动名称',
      align: 'center',
      fixed: 'left',
      dataIndex: 'activityName',
      ellipsis: true,
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityBeginTime',
      render: (val, record) => `${val} - ${record.activityEndTime}`,
    },
    {
      title: '活动城市',
      align: 'center',
      dataIndex: 'cityCity',
      ellipsis: true,
    },
    {
      title: '活动状态',
      align: 'center',
      dataIndex: 'activityStatus',
      render: (val) => ACTIVITY_STATUS[val],
    },
    {
      title: '剩余库存',
      align: 'center',
      dataIndex: 'kuCun',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '创建时间/创建人',
      align: 'center',
      dataIndex: 'aaaaa',
      //   render: (val) => (val ? val : '--'),
    },
    {
      type: 'handle',
      dataIndex: 'activityIdString',
      render: (val, record) => [
        {
          // 下架
          type: 'down',
          visible: record.activityStatus !== '2',
          click: () => fetchMarketActivityCancel({ activityId: val }),
        },
        {
          // 编辑
          type: 'edit',
          click: () => setVisible(true),
        },
      ],
    },
  ];

  // 活动下架
  const fetchMarketActivityCancel = (payload) => {
    dispatch({
      type: 'marketCardActivity/fetchMarketActivityCancel',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 设置活动
  const handleSetActive = () => setVisible(true);

  const btnExtra = [
    {
      text: '新增',
      auth: 'save',
      onClick: handleSetActive,
    },
  ];

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        loading={loading}
        btnExtra={btnExtra}
        columns={getColumns}
        searchItems={searchItems}
        params={params}
        rowKey={(record) => record.activityIdString}
        dispatchType="marketCardActivity/fetchGetList"
        //   {...marketCardActivity.active}
        {...data}
      ></TableDataBlock>
      {/* 新增，编辑 */}
      <AddNewActivitySet
        visible={visible}
        childRef={childRef}
        onClose={() => setVisible(false)}
      ></AddNewActivitySet>
    </>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading: loading.effects['marketCardActivity/fetchGetList'],
}))(AddNewActivity);
