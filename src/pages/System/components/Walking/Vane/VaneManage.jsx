import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import VaneDrawer from './components/VaneDrawer';

const tabList = [
  { key: 'windVane', tab: '风向标' },
  { key: 'beanEducation', tab: '四宫格' },
  { key: 'sixPalaceLattice', tab: '六宫格' },
  { key: 'beanDeductionZone', tab: '卡豆抵扣专区' },
  { key: 'fieldResource', tab: '田字资源位' },
];

const VaneManage = (props) => {
  const { list, loading, dispatch, visible = {}, onClose } = props;
  const { show, detail = {} } = visible;
  const { userOs, version, areaType, areaCode } = detail;

  const childRef = useRef();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [tabKey, setTabKey] = useState('windVane');

  // 获取详情
  const fetchGetDetail = (val, record, type) => {
    const { areaCode = '' } = record;
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneDetail',
      payload: {
        configWindVaneId: val,
      },
      callback: (detail) => setVisibleDrawer({ show: true, type, detail }),
    });
  };

  // 删除
  const fetchDetailDel = (configWindVaneId, record) => {
    const { areaCode = '' } = record;
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneEditDel',
      payload: {
        configWindVaneId,
        areaType: 'city',
        areaCode,
        deleteFlag: 0,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // 排序
  const fetchDetailSort = (list) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneSort',
      payload: {
        configWindVaneDTOList: list.map((item, i) => ({
          configWindVaneId: item.configWindVaneId,
          sort: i,
        })),
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '图标',
      dataIndex: 'image',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '显示名称',
      dataIndex: 'name',
      className: 'drag-visible',
    },
    {
      title: '排序',
      align: 'right',
      dataIndex: 'sort',
      render: () => <DragHandle />,
    },
    {
      type: 'handle',
      dataIndex: 'configWindVaneId',
      render: (val, record) => {
        return [
          {
            type: 'info',
            auth: true,
            click: () => fetchGetDetail(val, record, 'detail'),
          },
          {
            type: 'edit',
            auth: true,
            click: () => fetchGetDetail(val, record, 'edit'),
          },
          {
            type: 'del',
            auth: true,
            click: () => fetchDetailDel(val, record),
          },
        ];
      },
    },
  ];

  const modalProps = {
    title: '风向标配置',
    visible: show,
    onCancel: onClose,
    width: 1000,
    maskClosable: true,
    footer: false,
  };
  const cardBtnList = [
    {
      auth: true,
      text: '新增',
      className: 'dkl_blue_btn',
      onClick: () => {
        setVisibleDrawer({
          type: 'add',
          show: true,
          detail: { userOs, version, areaType, type: tabKey },
        });
      },
    },
  ];
  const cardBtnFlag = () => {
    if (['windVane', 'beanEducation', 'sixPalaceLattice'].includes(tabKey)) {
      return cardBtnList;
    } else if (['beanDeductionZone'].includes(tabKey) && list.list.length < 3) {
      return cardBtnList;
    } else if (['fieldResource'].includes(tabKey) && list.list.length < 4) {
      return cardBtnList;
    }
  };
  const handleTabChange = (key) => {
    setTabKey(key);
    childRef?.current?.fetchGetData({
      type: key,
      userOs,
      version,
      areaType,
      areaCode,
      isAutomatic: 0,
      deleteFlag: 1,
    });
  };
  return (
    <>
      <Modal destroyOnClose {...modalProps}>
        <TableDataBlock
          tableSort={{ key: 'configWindVaneId', onSortEnd: fetchDetailSort }}
          cardProps={{ tabList, activeTabKey: tabKey, onTabChange: handleTabChange }}
          cRef={childRef}
          btnExtra={cardBtnFlag()}
          loading={loading}
          pagination={false}
          columns={getColumns}
          params={{
            type: tabKey,
            userOs,
            version,
            areaType,
            areaCode,
            isAutomatic: 0,
            deleteFlag: 1,
          }}
          rowKey={(record) => `${record.configWindVaneId}`}
          dispatchType="walkingManage/fetchGetWindVaneConfigureList"
          {...list}
        ></TableDataBlock>
      </Modal>
      <VaneDrawer
        cRef={childRef}
        visible={visibleDrawer}
        cityCode={areaCode}
        onClose={() => setVisibleDrawer(false)}
      ></VaneDrawer>
    </>
  );
};

export default connect(({ walkingManage, loading }) => ({
  list: walkingManage.vaneConfigureList,
  loading:
    loading.effects['walkingManage/fetchWalkManageVaneList'] ||
    loading.effects['walkingManage/fetchWalkManageVaneEditDel'] ||
    loading.effects['walkingManage/fetchWalkManageVaneDetail'] ||
    loading.effects['walkingManage/fetchWalkManageVaneSort'],
}))(VaneManage);
