import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { ACTIVITY_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import MarketCardActivityDetail from './components/Activity/MarketCardActivityDetail';
import MarketCardActivitySet from './components/Activity/MarketCardActivitySet';

const MarketCardActivity = (props) => {
  const { marketCardActivity, loading, dispatch } = props;

  const childRef = useRef();
  const [show, setShow] = useState({ key: 'home', record: '' });
  const [visible, setVisible] = useState(false);
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
      title: '活动简述',
      align: 'center',
      dataIndex: 'description',
      ellipsis: true,
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
      callback: childRef.current.fetchGetData,
    });
  };

  // 设置活动
  const handleSetActive = () => setVisible(true);

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
      <MarketCardActivitySet
        visible={visible}
        cRef={childRef}
        onClose={() => setVisible(false)}
      ></MarketCardActivitySet>
    </>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading: loading.effects['marketCardActivity/fetchGetList'],
}))(MarketCardActivity);
