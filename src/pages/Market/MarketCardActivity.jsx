import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { ACTIVITY_STATUS } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import MarketCardActivityDetail from './components/Activity/MarketCardActivityDetail';
import MarketCardActivitySet from './components/Activity/MarketCardActivitySet';

const MarketCardActivity = (props) => {
  const { marketCardActivity, loading, dispatch } = props;

  const childRef = useRef();
  const [show, setShow] = useState({ key: 'home', record: '' });

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
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'eye',
              click: () => setShow({ key: 'detail', record }),
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

  // 设置活动
  const handleSetActive = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: MarketCardActivitySet({ dispatch, childRef }),
    });
  };

  const btnExtra = (
    <Button className="dkl_green_btn" key="1" onClick={handleSetActive}>
      新增活动
    </Button>
  );

  return (
    <>
      {
        {
          home: (
            <DataTableBlock
              cRef={childRef}
              loading={loading}
              btnExtra={btnExtra}
              columns={getColumns}
              searchItems={searchItems}
              rowKey={(record) => `${record.startDate}`}
              dispatchType="marketCardActivity/fetchGetList"
              {...marketCardActivity.active}
            ></DataTableBlock>
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
  loading: loading.models.marketCardActivity,
}))(MarketCardActivity);
