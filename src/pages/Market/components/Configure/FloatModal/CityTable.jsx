import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import CityDrawerSet from './components/CityDrawerSet';
import CityGlobalModal from './CityGlobalModal';

const CityTable = (props) => {
  const { loading, floatCityList, tabKey, version } = props;
  const [visible, setVisible] = useState(false);
  const [visibleConfigure, setVisibleConfigure] = useState({ show: false, info: {} });
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
      dataIndex: 'configFloatingWindowId',
      render: (_, row) => [
        {
          type: 'edit',
          title: '编辑',
          click: () => handleEdit(row),
          auth: true,
        },
      ],
    },
  ];

  const handleEdit = (row) => {
    const { userOs, version, area, cityCode } = row;
    setVisibleConfigure({
      show: true,
      detail: { userOs, version, area, cityCode },
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
        rowKey={(record) => `${record.configFloatingWindowId}`}
        params={{ userOs: tabKey, version, windowType: 'first', isAutomatic: 1 }}
        dispatchType="marketConfigure/fetchFloatingWindowCityList"
        {...floatCityList}
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
      <CityGlobalModal
        visible={visibleConfigure}
        onClose={() => setVisibleConfigure(false)}
        childRef={childRef}
      ></CityGlobalModal>
    </>
  );
};

export default connect(({ loading, marketConfigure }) => ({
  floatCityList: marketConfigure.floatCityList,
  loading: loading.effects['marketConfigure/fetchFloatingWindowCityList'],
}))(CityTable);
