import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { STROLLAROUND_TAB_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import EditionModal from './EditionModal';
import TabModal from './TabModal';
import TabTable from './TabTable';

const TabConfigure = (props) => {
  const { dispatch, loading, editionList } = props;
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('iOS');
  const [visibleEdition, setVisibleEdition] = useState(false);

  const childRef = useRef();

  const getColumns = [
    {
      title: '最低支持版本',
      align: 'center',
      dataIndex: 'version',
    },
    {
      type: 'handle',
      // align: 'center',
      dataIndex: 'configWanderAroundModuleId',
      render: (val, row) => [
        {
          type: 'edit',
          title: '编辑详情',
          click: () => {
            setVisible({
              show: true,
              type: 'edit',
              detail: row,
            });
          },
          auth: true,
        },
        {
          type: 'edit',
          title: '修改版本',
          click: () => {
            setVisibleEdition({
              show: true,
              type: 'edit',
              detail: row,
            });
          },
          auth: true,
        },
        {
          type: 'del',
          title: '删除版本',
          click: () => {
            handleDelVersion(val);
          },
          auth: true,
        },
      ],
    },
  ];

  // 删除版本
  const handleDelVersion = (configWanderAroundModuleId) => {
    dispatch({
      type: 'walkingManage/fetchAroundModuleEdit',
      payload: {
        configWanderAroundModuleId,
        flag: 'delete',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const cardBtnList = [
    {
      auth: true,
      text: '新增版本',
      className: 'dkl_blue_btn',
      onClick: () => {
        setVisibleEdition({
          show: true,
          type: 'add',
        });
      },
    },
  ];

  const handleTabChange = (key) => {
    setTabKey(key);
    if (key !== 'weChat' && key !== 'mark') {
      childRef?.current?.fetchGetData({ userOs: key, area: 'all', deleteFlag: 1 });
    }
  };

  return (
    <>
      <Card
        title="逛逛页面配置"
        tabList={Object.keys(STROLLAROUND_TAB_TYPE).map((i) => ({
          key: i,
          tab: STROLLAROUND_TAB_TYPE[i],
        }))}
        activeTabKey={tabKey}
        onTabChange={handleTabChange}
      >
        {tabKey !== 'weChat' && tabKey !== 'mark' ? (
          <TableDataBlock
            order
            noCard={false}
            cRef={childRef}
            loading={loading}
            columns={getColumns}
            btnExtra={cardBtnList}
            pagination={false}
            rowKey={(record) => `${record.configWanderAroundModuleId}`}
            params={{ userOs: tabKey, area: 'all', deleteFlag: 1 }}
            dispatchType="walkingManage/fetchAroundModuleList"
            {...editionList}
          />
        ) : (
          <TabTable tabKey={tabKey} />
        )}
      </Card>
      {/* 弹窗-新增版本 */}
      <EditionModal
        childRef={childRef}
        visible={visibleEdition}
        tabKey={tabKey}
        onClose={() => setVisibleEdition(false)}
      ></EditionModal>
      {/* 编辑详情-弹窗 */}
      <TabModal
        childRef={childRef}
        visible={visible}
        tabKey={tabKey}
        onClose={() => setVisible(false)}
      ></TabModal>
    </>
  );
};

export default connect(({ loading, walkingManage }) => ({
  editionList: walkingManage.editionList,
  loading: loading.models.walkingManage,
}))(TabConfigure);
