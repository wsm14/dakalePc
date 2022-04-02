import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { TAB_INDEX_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import EditionModal from './Form/EditionModal';
import TabModal from './TabComponents/TabModal';
import TabTable from './TabComponents/TabTable';

const TabConfigure = (props) => {
  const { dispatch, loading, IndexTabList } = props;
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
      dataIndex: 'configIndexTabId',
      render: (val, row) => [
        {
          type: 'tabEdit',
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
          type: 'tabEditVersion',
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
  const handleDelVersion = (configIndexTabId) => {
    dispatch({
      type: 'globalConfig/fetchIndexTabEdit',
      payload: {
        configIndexTabId,
        flag: 'delete',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const cardBtnList = [
    {
      auth: 'tabSaveVersion',
      text: '新增版本',
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
    if (key !== 'weChat') {
      childRef?.current?.fetchGetData({ userOs: key, area: 'all', deleteFlag: 1 });
    }
  };

  return (
    <>
      <Card
        title="视频标签配置"
        tabList={Object.keys(TAB_INDEX_TYPE).map((i) => ({ key: i, tab: TAB_INDEX_TYPE[i] }))}
        activeTabKey={tabKey}
        onTabChange={handleTabChange}
      >
        {tabKey !== 'weChat' ? (
          <TableDataBlock
            order
            noCard={false}
            cRef={childRef}
            loading={loading}
            columns={getColumns}
            btnExtra={cardBtnList}
            pagination={false}
            rowKey={(record) => `${record.configIndexTabId}`}
            params={{ userOs: tabKey, area: 'all', deleteFlag: 1 }}
            dispatchType="globalConfig/fetchIndexTabList"
            {...IndexTabList}
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

export default connect(({ loading, globalConfig }) => ({
  IndexTabList: globalConfig.IndexTabList,
  loading: loading.models.globalConfig,
}))(TabConfigure);
