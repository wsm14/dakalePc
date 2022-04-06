import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { BOTTOM_ICON_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import BottomIconEditionModal from './Form/BottomIconEditionModal';
import BottomIconConfigSet from './Form/BottomIconConfigSet';

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
          type: 'iconEdit',
          title: '编辑详情',
          click: () => handleDetail(val),
          auth: true,
        },
        {
          type: 'iconVersionEdit',
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
          type: 'iconVersionDel',
          pop: true,
          title: '删除版本',
          click: () => {
            handleDelVersion(val);
          },
          auth: true,
        },
      ],
    },
  ];

  const handleDelVersion = (configBottomCenterIconId) => {
    dispatch({
      type: 'globalConfig/fetchUpdateConfigBottomCenterIcon',
      payload: {
        configBottomCenterIconId,
        flag: 'delete',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const handleDetail = (configBottomCenterIconId) => {
    dispatch({
      type: 'globalConfig/fetchGetConfigBottomCenterIconById',
      payload: {
        configBottomCenterIconId,
      },
      callback: (detail) => {
        setVisible({ show: true, detail });
      },
    });
  };

  const cardBtnList = [
    {
      auth: 'iconVersionSave',
      text: '新增版本',
      onClick: () => {
        setVisibleEdition({
          show: true,
          type: 'add',
        });
      },
    },
  ];

  return (
    <>
      <Card
        title="底部中心icon配置"
        tabList={Object.keys(BOTTOM_ICON_TYPE).map((i) => ({ key: i, tab: BOTTOM_ICON_TYPE[i] }))}
        activeTabKey={tabKey}
        onTabChange={(key) => {
          setTabKey(key);
          childRef?.current?.fetchGetData({ userOs: key });
        }}
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
          params={{ userOs: tabKey, deleteFlag: 1 }}
          dispatchType="globalConfig/fetchListConfigBottomCenterIcon"
          {...bottomIconList}
        />
      </Card>
      {/* 弹窗-新增版本、修改 */}
      <BottomIconEditionModal
        childRef={childRef}
        visible={visibleEdition}
        tabKey={tabKey}
        onClose={() => setVisibleEdition(false)}
      ></BottomIconEditionModal>
      {/* 编辑详情-弹窗 */}
      <BottomIconConfigSet
        childRef={childRef}
        visible={visible}
        tabKey={tabKey}
        onClose={() => setVisible(false)}
      ></BottomIconConfigSet>
    </>
  );
};

export default connect(({ loading, globalConfig }) => ({
  bottomIconList: globalConfig.bottomIconList,
  loading: loading.models.globalConfig,
}))(TabConfigure);
