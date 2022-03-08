import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { BANNER_PORT_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import EditionModal from './components/App/EditionModal';
import AppSetModal from './components/App/AppSetModal';
import AppSetList from './components/App/AppSetList';

const AppSetTabList = (props) => {
  const { dispatch, loading, sysAppList } = props;
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('user');
  const [tabKeyTwo, setTabKeyTwo] = useState('iOS');
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
      dataIndex: 'bannerIdString',
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
            console.log('del', val);
          },
          auth: true,
        },
      ],
    },
  ];

  const handleDelVersion = () => {
    dispatch({
      type: '',
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
    setTabKeyTwo('iOS');
    setTabKey(key);
    if (['user', 'merchant'].includes(key)) {
      childRef?.current?.fetchGetData({
        userType: key,
        userOs: tabKeyTwo,
        isAutomatic: 1,
      });
    }
  };

  const handleTabChangeTwo = (key) => {
    setTabKeyTwo(key);
    childRef?.current?.fetchGetData({
      userType: tabKey,
      userOs: key,
      isAutomatic: 1,
    });
  };

  return (
    <>
      <Card
        tabList={Object.keys(BANNER_PORT_TYPE).map((i) => ({ key: i, tab: BANNER_PORT_TYPE[i] }))}
        activeTabKey={tabKey}
        onTabChange={handleTabChange}
      >
        {['user', 'merchant'].includes(tabKey) ? (
          <Card
            tabList={Object.keys(['iOS', 'android']).map((i) => ({
              key: ['iOS', 'android'][i],
              tab: ['iOS', 'android'][i],
            }))}
            activeTabKey={tabKeyTwo}
            onTabChange={handleTabChangeTwo}
            bordered={false}
          >
            <TableDataBlock
              order
              noCard={false}
              cRef={childRef}
              loading={loading}
              pagination={false}
              columns={getColumns}
              btnExtra={cardBtnList}
              rowKey={(record) => `${record.bannerIdString}`}
              params={{ userType: tabKey, userOs: tabKeyTwo, isAutomatic: 1 }}
              dispatchType="sysAppList/fetchGetList"
              {...sysAppList}
            />
          </Card>
        ) : (
          <AppSetList tabKey={tabKey} tabKeyTwo={tabKey} />
        )}
      </Card>
      {/* 弹窗-新增版本 */}
      <EditionModal
        childRef={childRef}
        visible={visibleEdition}
        tabKey={tabKey}
        tabKeyTwo={tabKeyTwo}
        onClose={() => setVisibleEdition(false)}
      ></EditionModal>
      {/* 编辑详情-弹窗 */}
      <AppSetModal
        childRef={childRef}
        visible={visible}
        tabKey={tabKey}
        tabKeyTwo={tabKeyTwo}
        onClose={() => setVisible(false)}
      ></AppSetModal>
    </>
  );
};

export default connect(({ loading, sysAppList }) => ({
  sysAppList: sysAppList.list,
  loading: loading.models.sysAppList,
}))(AppSetTabList);
