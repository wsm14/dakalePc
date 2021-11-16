import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import ShareWeightSet from './components/ShareWeightSet';
import GlobalModalDrawerSet from './components/GlobalModalDrawerSet';
import { MODAL_FREQUENCY, MARKET_LOOK_AREA, MARKET_STATUS_TYPE } from '@/common/constant';
import moment from 'moment';

const tabList = [
  {
    key: 'pickup',
    tab: '捡豆页面',
  },
  {
    key: 'wanderAround',
    tab: '逛逛页面',
  },
  {
    key: 'main',
    tab: '我的页面',
  },
  {
    key: 'goodsDetail',
    tab: '商品详情页',
  },
];

const CityGlobalModal = (props) => {
  const { modalConfigureList, loading, visible, onClose, dispatch } = props;
  const { show, detail = {} } = visible;
  const childRef = useRef();
  //tab切换
  const [tabKey, setTabKey] = useState('pickup');
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
      title: '弹窗名称',
      dataIndex: 'name',
    },
    {
      title: '弹窗频率',
      dataIndex: 'frequencyType',
      render: (val) => MODAL_FREQUENCY[val],
    },
    {
      title: '活动时间',
      dataIndex: 'activityBeginTime',
      render: (val, row) => (val ? `${val}~${row?.activityEndTime}` : '--'),
    },
    {
      title: '可见范围',
      dataIndex: 'visibleRange',
      render: (val) => MARKET_LOOK_AREA[val],
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: (val, row) => MARKET_STATUS_TYPE[changeTime(row)],
    },
    {
      title: '权重',
      align: 'center',
      // fixed: 'right',
      dataIndex: 'weight',
      render: (val, row) => (
        <ShareWeightSet detail={row} onSubmit={fetchNewShareNoAudit}></ShareWeightSet>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'configGlobalPopUpId',
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
      detail: { ...detail, pageType: tabKey, popUpType: 'image' },
    });
  };

  //编辑
  const handleEdit = (configGlobalPopUpId) => {
    dispatch({
      type: 'marketConfigure/fetchGlobalPopUpConfigureDetail',
      payload: {
        configGlobalPopUpId,
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
  const handleDown = (configGlobalPopUpId) => {
    dispatch({
      type: 'marketConfigure/fetchGlobalPopUpEdit',
      payload: {
        configGlobalPopUpId,
        flag: 'offShelf',
      },
      callback: childRef.current.fetchGetData,
    });
  };

  //删除
  const handleDelete = (configGlobalPopUpId) => {
    dispatch({
      type: 'marketConfigure/fetchGlobalPopUpEdit',
      payload: {
        configGlobalPopUpId,
        flag: 'delete',
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // 编辑权重
  const fetchNewShareNoAudit = (values, callback) => {
    dispatch({
      type: 'marketConfigure/fetchGlobalPopUpEdit',
      payload: values,
      callback,
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
    title: '全局弹窗配置',
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
          rowKey={(record) => `${record.configGlobalPopUpId}`}
          dispatchType="marketConfigure/fetchGlobalPopUpModalList"
          params={{ ...detail, pageType: tabKey, isAutomatic: 0, deleteFlag: 1 }}
          {...modalConfigureList}
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
  modalConfigureList: marketConfigure.modalConfigureList,
  loading:
    loading.effects['marketConfigure/fetchGlobalPopUpModalList'] ||
    loading.effects['marketConfigure/fetchGlobalPopUpEdit'],
}))(CityGlobalModal);
