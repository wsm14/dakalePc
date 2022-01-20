import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { BOTTOM_ICON_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import BottomIconEditionModal from './Form/BottomIconEditionModal';
import TabModal from './TabComponents/TabModal';

const TabConfigure = (props) => {
  const { dispatch, loading, bottomIconList } = props;
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
      dataIndex: 'configBottomCenterIconId',
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
      ],
    },
  ];

  const cardBtnList = [
    {
      auth: 'save',
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
    childRef?.current?.fetchGetData({ userOs: key, area: 'all' });
  };

  return (
    <>
      <Card
        title="视频标签配置"
        tabList={Object.keys(BOTTOM_ICON_TYPE).map((i) => ({ key: i, tab: BOTTOM_ICON_TYPE[i] }))}
        activeTabKey={tabKey}
        onTabChange={handleTabChange}
      >
        <TableDataBlock
          order
          noCard={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          btnExtra={cardBtnList}
          pagination={false}
          rowKey={(record) => `${record.configBottomCenterIconId}`}
          params={{ userOs: tabKey, isAutomatic: 1, deleteFlag: 1 }}
          dispatchType="globalConfig/fetchListConfigBottomCenterIcon"
          {...bottomIconList}
        />
      </Card>
      {/* 弹窗-新增版本 */}
      <BottomIconEditionModal
        childRef={childRef}
        visible={visibleEdition}
        tabKey={tabKey}
        onClose={() => setVisibleEdition(false)}
      ></BottomIconEditionModal>
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
  bottomIconList: globalConfig.bottomIconList,
  loading: loading.models.globalConfig,
}))(TabConfigure);
