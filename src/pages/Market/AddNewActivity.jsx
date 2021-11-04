import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { ACTIVITY_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import AddNewActivitySet from './components/AddNewActivity/AddNewActivitySet';
import { checkCityName } from '@/utils/utils';

// 拉新活动
const AddNewActivity = (props) => {
  const { addNewList, loading, dispatch } = props;

  console.log('addNewList', addNewList);

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 新增+编辑

  // 搜索参数
  const searchItems = [
    {
      label: '活动名称',
      name: 'name',
    },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: ACTIVITY_STATUS,
    },
    {
      label: '活动城市',
      name: 'cityCode',
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
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityBeginTime',
      render: (val, record) => `${val.slice(0, 10)} ~ ${record.activityEndTime.slice(0, 10)}`,
    },
    {
      title: '活动城市',
      align: 'center',
      dataIndex: 'cityCode',
      ellipsis: true,
      render: (val) => checkCityName(val),
    },
    {
      title: '活动状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ACTIVITY_STATUS[val],
    },
    {
      title: '剩余库存',
      align: 'center',
      dataIndex: 'remain',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '创建时间/创建人',
      align: 'center',
      // dataIndex: 'aaaaa',
      render: (val, record) => `${record.createTime}\n${record.creator}`,
    },
    {
      type: 'handle',
      dataIndex: 'configFissionTemplateId',
      render: (val, record, index) => [
        {
          // 下架
          type: 'down',
          visible: record.activityStatus !== '2',
          click: () => fetchMarketActivityCancel({ activityId: val }),
        },
        {
          // 编辑
          type: 'edit',
          click: () => fetchAddNewDetail(val),
        },
      ],
    },
  ];

  // 获取详情
  const fetchAddNewDetail = (id) => {
    dispatch({
      type: 'addNewActivity/fetchMarketAddNewActivityDetail',
      payload: {
        configFissionTemplateId: id,
      },
      callback: (detail) => setVisible({ show: true, detail }),
    });
  };
  // const fetchShareDetail = (index, type) => {
  //   const { momentId, ownerId } = list[index];
  //   dispatch({
  //     type: 'videoPlatform/fetchNewShareDetail',
  //     payload: {
  //       momentId,
  //       ownerId,
  //       type,
  //     },
  //     callback: (detail) => setVisible({ show: true, index, type, detail }),
  //   });
  // };

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
        rowKey={(record) => record.configFissionTemplateId}
        dispatchType="addNewActivity/fetchGetList"
        {...addNewList}
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

export default connect(({ addNewActivity, loading }) => ({
  addNewList: addNewActivity,
  loading: loading.effects['addNewActivity/fetchGetList'],
}))(AddNewActivity);
