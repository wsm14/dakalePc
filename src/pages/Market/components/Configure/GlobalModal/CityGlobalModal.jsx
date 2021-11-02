import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import ShareWeightSet from './components/ShareWeightSet';
import GlobalModalDrawerSet from './components/GlobalModalDrawerSet';
import { MODAL_FREQUENCY, BANNER_LOOK_AREA } from '@/common/constant';

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
  const { show } = visible;
  const tableRef = useRef();
  const [tabKey, setTabKey] = useState('pickup');
  const [visibleSet, setVisibleSet] = useState(false);

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
      dataIndex: 'createTime',
    },
    {
      title: '可见范围',
      dataIndex: 'visibleRange',
      render: (val) => BANNER_LOOK_AREA[val],
    },
    {
      title: '活动状态',
      dataIndex: 'status',
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
      dataIndex: 'url',
      render: (val) => [
        {
          type: 'edit',
          click: () => handleEdit(val, row),
          auth: true,
        },
        {
          type: 'down',
          click: () => handleEdit(val, row),
          auth: true,
        },
        {
          type: 'del',
          click: () => handleEdit(val, row),
          auth: true,
        },
      ],
    },
  ];

  //  新增/编辑
  const handleUpdateSet = () => {
    setVisibleSet({
      show: true,
      tabKey,
    });
  };

  // 修改不审核
  const fetchNewShareNoAudit = (values, callback) => {
    console.log(values, callback);
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
      onClick: handleUpdateSet,
    },
  ];
  const modalProps = {
    title: '全局弹窗配置',
    visible: show,
    onCancel: onClose,
    width: 1000,
    maskClosable: true,
    footer: false,
  };

  return (
    <>
      <Modal destroyOnClose {...modalProps} loading={loading}>
        <TableDataBlock
          // firstFetch={false}
          cardProps={{
            tabList: tabList,
            activeTabKey: tabKey,
            onTabChange: setTabKey,
            tabBarExtraContent: <ExtraButton list={cardBtnList}></ExtraButton>,
            bordered: false,
          }}
          cRef={tableRef}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.configGlobalPopUpId}`}
          dispatchType="marketConfigure/fetchGlobalPopUpModalList"
          params={{ pageType: tabKey }}
          {...modalConfigureList}
        ></TableDataBlock>
      </Modal>
      {/* 新增/编辑 */}
      <GlobalModalDrawerSet
        visible={visibleSet}
        childRef={tableRef}
        onClose={() => setVisibleSet(false)}
      ></GlobalModalDrawerSet>
    </>
  );
};
export default connect(({ loading, marketConfigure }) => ({
  modalConfigureList: marketConfigure.modalConfigureList,
  loading: loading.effects['marketConfigure/fetchGlobalPopUpModalList'],
}))(CityGlobalModal);
