import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import CityDrawerSet from './components/CityDrawerSet';
import GratiaClassManage from './GratiaClass';
const TabTable = (props) => {
  const { dispatch, loading, gratiaClassCityList, tabKey, version } = props;
  const [visible, setVisible] = useState(false);
  const [visibleConfigure, setVisibleConfigure] = useState({ show: false });
  const childRef = useRef();

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
      dataIndex: 'configSpecialGoodsCategoryId',
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
        rowKey={(record) => `${record.configSpecialGoodsCategoryId}`}
        params={{ userOs: tabKey, version, isAutomatic: 1 }}
        dispatchType="walkingManage/fetchListConfigSpecialGoodsCategoryCity"
        {...gratiaClassCityList}
      ></TableDataBlock>
      {/* 新增城市弹窗 */}
      <CityDrawerSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
        tabKey={tabKey}
        version={version}
      ></CityDrawerSet>
      {/* 编辑弹窗 */}
      <GratiaClassManage
        visible={visibleConfigure}
        onClose={() => setVisibleConfigure(false)}
      ></GratiaClassManage>
    </>
  );
};

export default connect(({ loading, walkingManage }) => ({
  gratiaClassCityList: walkingManage.gratiaClassCityList,
  loading: loading.effects['walkingManage/fetchListConfigSpecialGoodsCategoryCity'],
}))(TabTable);
