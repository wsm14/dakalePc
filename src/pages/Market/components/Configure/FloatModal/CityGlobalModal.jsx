import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import GlobalModalDrawerSet from './components/GlobalModalDrawerSet';
import { MARKET_STATUS_TYPE } from '@/common/constant';

const tabList = [
  {
    key: 'first',
    tab: '浮窗一',
  },
  {
    key: 'second',
    tab: '浮窗二',
  },
];

const CityGlobalModal = (props) => {
  const { floatConfigureList, loading, visible, onClose, dispatch } = props;
  const { show, detail = {} } = visible;
  const childRef = useRef();
  //tab切换
  const [tabKey, setTabKey] = useState('first');
  const [visibleSet, setVisibleSet] = useState(false);

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ pageType: tabKey });
  }, [tabKey]);

  const changeTime = (row) => {
    let { activityBeginTime, activityEndTime } = row;
    if (activityBeginTime && activityEndTime) {
      const nowTime = new Date().getTime();
      activityBeginTime = new Date(activityBeginTime).getTime();
      activityEndTime = new Date(activityEndTime).getTime();
      if (nowTime >= activityBeginTime && nowTime <= activityEndTime) {
        return 1;
      } else if (nowTime < activityBeginTime) {
        return 0;
      } else if (nowTime > activityEndTime) {
        return 2;
      }
    }
    return '';
  };

  const getColumns = [
    {
      title: '浮窗名称',
      dataIndex: 'name',
    },
    {
      title: '活动时间',
      dataIndex: 'activityBeginTime',
      render: (val, row) => (val ? `${val}~${row?.activityEndTime}` : '--'),
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: (val, row) => MARKET_STATUS_TYPE[changeTime(row)],
    },

    {
      type: 'handle',
      dataIndex: 'configFloatingWindowId',
      render: (val, row) => {
        const status = changeTime(row);
        return [
          {
            type: 'edit',
            visible: status !== 2,
            click: () => handleEdit(val),
          },
          {
            type: 'down',
            visible: status !== 2,
            click: () => handleDown(val),
          },
          {
            type: 'del',
            visible: status === 2,
            click: () => handleDelete(val),
          },
        ];
      },
    },
  ];

  //  新增
  const handleAdd = () => {
    setVisibleSet({
      show: true,
      detail: { ...detail, windowType: tabKey },
    });
  };

  //编辑
  const handleEdit = (configFloatingWindowId) => {
    dispatch({
      type: 'marketConfigure/fetchFloatingWindowConfigureDetail',
      payload: {
        configFloatingWindowId,
      },
      callback: (detail) => {
        setVisibleSet({
          show: true,
          type: 'edit',
          detail,
        });
      },
    });
  };

  //下架
  const handleDown = (configFloatingWindowId) => {
    dispatch({
      type: 'marketConfigure/fetchFloatingWindowEdit',
      payload: {
        configFloatingWindowId,
        flag: 'offShelf',
      },
      callback: childRef.current.fetchGetData,
    });
  };

  //删除
  const handleDelete = (configFloatingWindowId) => {
    dispatch({
      type: 'marketConfigure/fetchFloatingWindowEdit',
      payload: {
        configFloatingWindowId,
        flag: 'delete',
      },
      callback: childRef.current.fetchGetData,
    });
  };
  const cardBtnList = [
    {
      text: '新增',
      auth: 'save',
      className: 'dkl_blue_btn',
      onClick: handleAdd,
    },
  ];
  const modalProps = {
    title: '浮窗配置',
    visible: show,
    onCancel: onClose,
    width: 1000,
    maskClosable: true,
    footer: false,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
  };

  return (
    <>
      <Modal destroyOnClose {...modalProps} loading={loading}>
        <TableDataBlock
          cardProps={{
            tabList: tabList,
            activeTabKey: tabKey,
            onTabChange: setTabKey,
            tabBarExtraContent: <ExtraButton list={cardBtnList}></ExtraButton>,
            bordered: false,
          }}
          pagination={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.configFloatingWindowId}`}
          dispatchType="marketConfigure/fetchFloatingWindowConfigureList"
          params={{ ...detail, windowType: tabKey, isAutomatic: 0 }}
          {...floatConfigureList}
        ></TableDataBlock>
      </Modal>
      {/* 新增/编辑 */}
      <GlobalModalDrawerSet
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></GlobalModalDrawerSet>
    </>
  );
};
export default connect(({ loading, marketConfigure }) => ({
  floatConfigureList: marketConfigure.floatConfigureList,
  loading: loading.effects['marketConfigure/fetchFloatingWindowConfigureList'],
}))(CityGlobalModal);
