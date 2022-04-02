import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { STROLLAROUND_TAB_TYPE } from '@/common/constant';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import TabDrawerSet from './TabDrawerSet';
import StrollTemplateEdit from '../StrollTemplate/StrollTemplateEdit';

const TabTable = (props) => {
  const {
    dispatch,
    loading,
    configureList,
    tabKey,
    version,
    // fetchTable
  } = props;
  const [visible, setVisible] = useState(false);
  const [visibleConfigure, setVisibleConfigure] = useState({ show: false, info: {} });

  const childRef = useRef();

  // useEffect(() => {
  //   fetchTable && fetchTable(childRef);
  // }, []);

  useEffect(() => {
    if (tabKey === 'weChat' || tabKey === 'mark') {
      childRef?.current?.fetchGetData({ userOs: tabKey });
    }
  }, [tabKey]);

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
  const handleDelCity = (configWanderAroundModuleId) => {
    dispatch({
      type: 'walkingManage/fetchUpdateWanderAroundModule',
      payload: {
        configWanderAroundModuleId,
        flag: 'delete',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const handleEdit = (configWanderAroundModuleId, row) => {
    dispatch({
      type: 'walkingManage/fetchGetWanderAroundModuleById',
      payload: {
        configWanderAroundModuleId,
      },
      callback: (detail) => {
        const info = {
          activityName: `逛逛页面配置-${STROLLAROUND_TAB_TYPE[row?.userOs]}${
            row?.version ? '-' : ''
          }${row?.version}`,
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
        pagination={false}
        btnExtra={cardBtnList}
        rowKey={(record) => `${record.configWanderAroundModuleId}`}
        params={{ userOs: tabKey, version, deleteFlag: 1 }}
        dispatchType="walkingManage/fetchAroundModuleCityList"
        {...configureList}
      ></TableDataBlock>
      {/* 新增弹窗 */}
      <TabDrawerSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
        tabKey={tabKey}
        version={version}
      ></TabDrawerSet>
      {/* 编辑弹窗 */}
      <StrollTemplateEdit
        key="template"
        visible={visibleConfigure}
        onClose={() => setVisibleConfigure(false)}
      ></StrollTemplateEdit>
    </>
  );
};

export default connect(({ loading, walkingManage }) => ({
  configureList: walkingManage.configureList,
  loading: loading.effects['walkingManage/fetchAroundModuleCityList'],
}))(TabTable);
