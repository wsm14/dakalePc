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
    tab: '捡豆页面',
  },
  {
    key: 'merchant',
    tab: '逛逛页面',
  },
  {
    key: '11',
    tab: '我的页面',
  },
  {
    key: '22',
    tab: '商品详情页',
  },
];

const CityGlobalModal = (props) => {
  const { materialConfig, loading, visible, onClose } = props;
  const { show } = visible;
  const tableRef = useRef();
  const [tabKey, setTabKey] = useState('user');
  const [visibleSet, setVisibleSet] = useState(false);

  const getColumns = [
    {
      title: '弹窗名称',
      dataIndex: 'matterName',
    },
    {
      title: '弹窗频率',
      dataIndex: 'creator',
    },
    {
      title: '活动时间',
      dataIndex: 'createTime',
    },
    {
      title: '可见范围',
      dataIndex: 'creator',
    },
    {
      title: '活动状态',
      dataIndex: 'creator',
    },
    {
      title: '权重',
      // align: 'center',
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
          type: 'download',
          click: () => handleZipDown(val),
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
    title: `全局弹窗配置`,
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
          dispatchType="materialConfig/fetchGetList"
          params={{ matterType: tabKey }}
          {...materialConfig}
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
export default connect(({ materialConfig, loading }) => ({
  materialConfig,
  loading: loading.models.materialConfig,
}))(CityGlobalModal);
