import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { BANNER_PORT_TYPE } from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import AddImgplace from './AddImgplace';
import EditionModal from './EditionModal';
import AppSetModal from './AppSetModal';
import CityTable from './CityTable';
import CityModal from './CityModal';

const AppSetTabList = (props) => {
  const { dispatch, loading, versionList } = props;
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('user');
  const [tabKeyTwo, setTabKeyTwo] = useState('iOS');
  const [visibleEdition, setVisibleEdition] = useState(false);
  const [visibleAddImg, setVisibleAddImg] = useState(false); // 新增位置

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
          type: 'bannerEdit',
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
          type: 'bannerUpVersion',
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
  const handleDelVersion = (bannerIdString) => {
    dispatch({
      type: 'sysAppList/fetchBannerEdit',
      payload: {
        bannerIdString,
        flag: 'deleteVersion',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const btnList = [
    {
      text: '新增位置',
      auth: 'bannerAddPlace',
      onClick: () => setVisibleAddImg(true),
    },
    {
      auth: 'bannerAddVersion',
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
        deleteFlag: 1,
        area: 'all',
      });
    }
  };

  const handleTabChangeTwo = (key) => {
    setTabKeyTwo(key);
    childRef?.current?.fetchGetData({
      userType: tabKey,
      userOs: key,
      isAutomatic: 1,
      deleteFlag: 1,
      area: 'all',
    });
  };

  // 获取banner分辨率配置
  const fetchBannerRatio = () => {
    dispatch({
      type: 'sysAppList/fetchBannerRatio',
      payload: {
        userType: tabKey,
        deleteFlag: 1,
      },
    });
  };

  return (
    <>
      <Card
        tabList={Object.keys(BANNER_PORT_TYPE).map((i) => ({ key: i, tab: BANNER_PORT_TYPE[i] }))}
        activeTabKey={tabKey}
        onTabChange={handleTabChange}
        bodyStyle={['user', 'merchant'].includes(tabKey) ? { padding: '1px 0 0' } : {}}
      >
        {['user', 'merchant'].includes(tabKey) ? (
          <Card
            tabList={Object.keys(['iOS', 'android']).map((i) => ({
              key: ['iOS', 'android'][i],
              tab: ['iOS', 'android'][i],
            }))}
            tabBarExtraContent={<ExtraButton list={btnList}></ExtraButton>}
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
              rowKey={(record) => `${record.bannerIdString}`}
              params={{
                userType: tabKey,
                userOs: tabKeyTwo,
                area: 'all',
                isAutomatic: 1,
                deleteFlag: 1,
              }}
              dispatchType="sysAppList/fetchGetList"
              {...versionList}
            />
          </Card>
        ) : (
          <CityTable tabKey={tabKey} />
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
      <CityModal
        childRef={childRef}
        visible={visible}
        tabKey={tabKey}
        tabKeyTwo={tabKeyTwo}
        onClose={() => setVisible(false)}
      ></CityModal>
      {/* 新增图片位置 */}
      <AddImgplace
        getType={() => fetchBannerRatio()}
        tabKey={tabKey}
        visible={visibleAddImg}
        onClose={() => setVisibleAddImg(false)}
      ></AddImgplace>
    </>
  );
};

export default connect(({ loading, sysAppList }) => ({
  versionList: sysAppList.versionList,
  loading: loading.models.sysAppList,
}))(AppSetTabList);
