import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { ACTIVITY_STATUS } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import MarketCardActivityDetail from './components/Activity/MarketCardActivityDetail';

const MarketCardActivity = (props) => {
  const { marketCardActivity, loading, dispatch, setKey, matchType } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '活动名称',
      name: 'date',
    },
    {
      label: '活动状态',
      name: 'date2',
      type: 'select',
      select: { list: ACTIVITY_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '活动名称',
      align: 'center',
      dataIndex: 'startDate',
      render: (val) => `${val}期`,
    },
    {
      title: '活动描述',
      align: 'center',
      dataIndex: 'signBeanAmount',
    },
    {
      title: '活动商家',
      align: 'center',
      dataIndex: 'signAmount',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'totalBeanAmount',
    },
    {
      title: '活动状态',
      align: 'center',
      dataIndex: 'targetUserAmount',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'eye',
              // click: () => fetchGetDetail(record.merchantId),
            },
            {
              type: 'own',
              title: '下架',
            },
          ]}
        />
      ),
    },
  ];

  // 获取挑战卡豆详情
  const handleMorningDetail = () => {
    // dispatch({
    //   type: 'drawerForm/show',
    //   payload: MarketMatchMorningSet({
    //     dispatch,
    //     childRef,
    //   }),
    // });
  };

  // 设置挑战卡豆数
  const handleSetMatch = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: propInfo.payload,
    });
  };

  const btnExtra = [
    <Button className="dkl_green_btn" key="1" onClick={handleSetMatch}>
      新增活动
    </Button>,
  ];

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.startDate}`}
        btnExtra={btnExtra}
        dispatchType="marketCardActivity/fetchGetList"
        {...marketCardActivity}
      ></DataTableBlock>
      <MarketCardActivityDetail></MarketCardActivityDetail>
    </>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading: loading.models.marketCardActivity,
}))(MarketCardActivity);
