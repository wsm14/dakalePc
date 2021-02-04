import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { ACTIVITY_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import MarketCardActivityDetail from './components/Activity/MarketCardActivityDetail';
import marketCardActivitySet from './components/Activity/MarketCardActivitySet';

const MarketCardActivity = (props) => {
  const { marketCardActivity, loading, dispatch } = props;

  const childRef = useRef();
  const [show, setShow] = useState({ key: 'home', record: '' });
  const [params, setParams] = useState({});

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
      select: { list: ACTIVITY_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '活动名称',
      align: 'center',
      fixed: 'left',
      dataIndex: 'activityName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '活动简述',
      align: 'center',
      dataIndex: 'description',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '活动商家',
      align: 'center',
      dataIndex: 'activityCount',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityBeginTime',
      render: (val, record) => `${val} - ${record.activityEndTime}`,
    },
    {
      title: '活动状态',
      align: 'center',
      dataIndex: 'activityStatus',
      render: (val) => ACTIVITY_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'activityIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'eye',
              click: () => setShow({ key: 'detail', record }),
            },
            {
              type: 'down',
              visible: record.activityStatus !== '2',
              click: () => fetchMarketActivityCancel({ activityId: val }),
            },
          ]}
        />
      ),
    },
  ];

  // 活动下架
  const fetchMarketActivityCancel = (payload) => {
    dispatch({
      type: 'marketCardActivity/fetchMarketActivityCancel',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 设置活动
  const handleSetActive = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: marketCardActivitySet({ dispatch, childRef }),
    });
  };

  const btnExtra = (
    <AuthConsumer auth="save">
      <Button className="dkl_green_btn" key="1" onClick={handleSetActive}>
        新增活动
      </Button>
    </AuthConsumer>
  );

  return (
    <>
      {
        {
          home: (
            <TableDataBlock
              keepData
              cRef={childRef}
              loading={loading}
              btnExtra={btnExtra}
              columns={getColumns}
              searchItems={searchItems}
              params={params}
              setParams={setParams}
              rowKey={(record) => record.activityIdString}
              dispatchType="marketCardActivity/fetchGetList"
              {...marketCardActivity.active}
            ></TableDataBlock>
          ),
          detail: (
            <MarketCardActivityDetail
              params={show.record}
              setShow={setShow}
            ></MarketCardActivityDetail>
          ),
        }[show.key]
      }
    </>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading: loading.effects['marketCardActivity/fetchGetList'],
}))(MarketCardActivity);
