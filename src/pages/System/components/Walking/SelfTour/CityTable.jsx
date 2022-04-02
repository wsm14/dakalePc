import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { TAB_INDEX_TYPE } from '@/common/constant';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import CityDrawerSet from './components/CityDrawerSet';
import SelfDrawer from './components/SelfDrawer';
const TabTable = (props) => {
  const { dispatch, loading, cityList, tabKey, version, fetchTable } = props;
  const [visible, setVisible] = useState(false);
  const [visibleConfigure, setVisibleConfigure] = useState({ show: false });
  const childRef = useRef();

  useEffect(() => {
    fetchTable && fetchTable(childRef);
  }, []);

  const getColumns = [
    {
      title: '城市',
      align: 'center',
      dataIndex: 'area',
      render: (val, row) => (val === 'all' ? '通用' : getCityName(row?.cityCode)),
    },
    {
      type: 'handle',
      align: 'center',
      dataIndex: 'configSelfTourGoodsId',
      render: (val, row) => [
        {
          type: 'edit',
          title: '编辑',
          click: () => handleEdit(val),
          auth: true,
        },
        {
          type: 'del',
          title: '删除',
          click: () => handleDelCity(val),
          visible: row.area !== 'all',
          auth: true,
        },
      ],
    },
  ];

  // 删除城市
  const handleDelCity = (configSelfTourGoodsId) => {
    dispatch({
      type: 'walkingManage/fetchGetSelfTourGoodsEdit',
      payload: {
        configSelfTourGoodsId,
        flag: 'delete',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const handleEdit = (configSelfTourGoodsId) => {
    dispatch({
      type: 'walkingManage/fetchGetSelfTourGoodsDetail',
      payload: { configSelfTourGoodsId },
      callback: (detail) => {
        setVisibleConfigure({
          show: true,
          detail: { configSelfTourGoodsId, specialGoods: detail },
        });
      },
    });
  };

  const cardBtnList = [
    {
      auth: true,
      text: '新增城市',
      className: 'dkl_blue_btn',
      onClick: () => {
        setVisible({
          show: true,
          type: 'add',
        });
      },
    },
  ];
  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        pagination={false}
        btnExtra={cardBtnList}
        rowKey={(record) => `${record.configSelfTourGoodsId}`}
        params={{ userOs: tabKey, version, isAutomatic: 1, deleteFlag: 1 }}
        dispatchType="walkingManage/fetchGetSelfTourCityList"
        {...cityList}
      ></TableDataBlock>
      {/* 新增弹窗 */}
      <CityDrawerSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
        tabKey={tabKey}
        version={version}
      ></CityDrawerSet>
      {/* 编辑弹窗 */}
      <SelfDrawer
        visible={visibleConfigure}
        childRef={childRef}
        onClose={() => setVisibleConfigure(false)}
      ></SelfDrawer>
    </>
  );
};

export default connect(({ loading, walkingManage }) => ({
  cityList: walkingManage.selfCityList,
  loading: loading.effects['walkingManage/fetchGetSelfTourCityList'],
}))(TabTable);
