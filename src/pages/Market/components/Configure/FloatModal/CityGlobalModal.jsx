import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import ShareWeightSet from './components/ShareWeightSet';
import GlobalModalDrawerSet from './components/GlobalModalDrawerSet';

const tabList = [
  {
    key: 'user',
    tab: '浮窗1',
  },
  {
    key: 'merchant',
    tab: '浮窗2',
  },
];

const CityGlobalModal = (props) => {
  const { configureList, loading, visible, onClose } = props;
  const { show } = visible;
  const tableRef = useRef();
  const [tabKey, setTabKey] = useState('user');
  const [visibleSet, setVisibleSet] = useState(false);

  const getColumns = [
    {
      title: '浮窗名称',
      dataIndex: 'matterName',
    },
    {
      title: '活动时间',
      dataIndex: 'createTime',
    },
    {
      title: '活动状态',
      dataIndex: 'creator',
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
    dispatch({
      type: 'videoPlatform/fetchNewShareNoAudit',
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
          firstFetch={false}
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
          rowKey={(record) => `${record.matterConfigId}`}
          dispatchType="marketConfigure/fetchAroundModuleCityList"
          params={{ matterType: tabKey }}
          {...configureList}
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
  configureList: marketConfigure.configureList,
  loading: loading.effects['marketConfigure/fetchAroundModuleCityList'],
}))(CityGlobalModal);
