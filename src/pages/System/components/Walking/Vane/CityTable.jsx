import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { TAB_INDEX_TYPE } from '@/common/constant';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import CityDrawerSet from './components/CityDrawerSet';
import VaneManage from './VaneManage';
const TabTable = (props) => {
  const { dispatch, loading, vaneCityList, tabKey, version, fetchTable } = props;
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
      dataIndex: 'areaType',
      render: (val, row) => (val === 'all' ? '通用' : getCityName(row?.areaCode)),
    },
    {
      type: 'handle',
      align: 'center',
      dataIndex: 'configWindVaneId',
      render: (val, row) => [
        {
          type: 'edit',
          title: '编辑',
          click: () => handleEdit(row),
          auth: true,
        },
      ],
    },
  ];

  const handleEdit = (detail) => {
    setVisibleConfigure({
      show: true,
      detail: detail,
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
        rowKey={(record) => `${record.configWindVaneId}`}
        params={{ userOs: tabKey, version, isAutomatic: 1 }}
        dispatchType="walkingManage/fetchGetWindVaneCityList"
        {...vaneCityList}
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
      <VaneManage
        visible={visibleConfigure}
        onClose={() => setVisibleConfigure(false)}
      ></VaneManage>
    </>
  );
};

export default connect(({ loading, walkingManage }) => ({
  vaneCityList: walkingManage.vaneCityList,
  loading: loading.effects['walkingManage/fetchGetWindVaneCityList'],
}))(TabTable);
