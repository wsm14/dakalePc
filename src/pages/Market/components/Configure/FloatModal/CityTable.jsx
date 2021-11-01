import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { TAB_INDEX_TYPE } from '@/common/constant';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import CityDrawerSet from './CityDrawerSet';
import CityTabConfigure from '../GlobalModal/CityGlobalModal';

const CityTable = (props) => {
  const { dispatch, loading, configureList, tabKey, version, fetchTable } = props;
  const [visible, setVisible] = useState(false);
  const [visibleConfigure, setVisibleConfigure] = useState({ show: false, info: {} });
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
      dataIndex: 'configWanderAroundModuleId',
      render: (val, row) => [
        {
          type: 'edit',
          title: '编辑',
          click: () => handleEdit(val, row),
          auth: true,
        },
      ],
    },
  ];

  const handleEdit = (configWanderAroundModuleId, row) => {
    dispatch({
      type: 'marketConfigure/fetchGetWanderAroundModuleById',
      payload: {
        configWanderAroundModuleId,
      },
      callback: (detail) => {
        const info = {
          activityName: `逛逛页面配置-${TAB_INDEX_TYPE[row?.userOs]}${row?.version ? '-' : ''}${
            row?.version
          }`,
          handle: 'edit',
          configWanderAroundModuleId,
          params: { ...detail, dataList: detail?.wanderAroundModuleObjects || [] },
        };
        setVisibleConfigure({
          show: true,
          info,
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
        btnExtra={cardBtnList}
        rowKey={(record) => `${record.configWanderAroundModuleId}`}
        params={{ userOs: tabKey, version }}
        dispatchType="marketConfigure/fetchAroundModuleCityList"
        {...configureList}
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
      <CityTabConfigure
        visible={visibleConfigure}
        onClose={() => setVisibleConfigure(false)}
        childRef={childRef}
      ></CityTabConfigure>
    </>
  );
};

export default connect(({ loading, marketConfigure }) => ({
  configureList: marketConfigure.configureList,
  loading: loading.effects['marketConfigure/fetchAroundModuleCityList'],
}))(CityTable);
