import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import CityDrawerSet from './CityDrawerSet';
import AppSetList from './AppSetList';
import AddImgplace from './AddImgplace';

const CityTable = (props) => {
  const { loading, cityList, tabKey, tabKeyTwo, version, dispatch } = props;
  const [visible, setVisible] = useState(false);
  const [visibleConfigure, setVisibleConfigure] = useState({ show: false, info: {} });
  const [visibleAddImg, setVisibleAddImg] = useState(false); // 新增位置

  const childRef = useRef();

  useEffect(() => {
    childRef?.current?.fetchGetData();
    fetchBannerRatio();
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
      dataIndex: 'bannerIdString',
      render: (val, row) => [
        {
          type: 'globalPopEdit',
          title: '编辑',
          click: () => handleEdit(row),
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
  const handleDelCity = (bannerIdString) => {
    dispatch({
      type: 'sysAppList/fetchBannerEdit',
      payload: {
        bannerIdString,
        flag: 'deleteCity',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const handleEdit = (row) => {
    const { userType, userOs, version, area, cityCode } = row;
    setVisibleConfigure({
      show: true,
      detail: { userType, userOs, version, area, cityCode },
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

  const cardBtnList = [
    {
      text: '新增位置',
      auth: 'bannerAddPlace',
      onClick: () => setVisibleAddImg(true),
      show: ['weChat', 'mark', 'communityWechat'].includes(tabKey),
    },
    {
      auth: 'globalAddCity',
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
        rowKey={(record) => `${record.bannerIdString}`}
        params={{ userType: tabKey, userOs: tabKeyTwo, version, isAutomatic: 1, deleteFlag: 1 }}
        dispatchType="sysAppList/fetchGetCityList"
        {...cityList}
      ></TableDataBlock>
      {/* 新增弹窗 */}
      <CityDrawerSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
        tabKey={tabKey}
        tabKeyTwo={['weChat', 'mark', 'communityWechat'].includes(tabKey) ? tabKey : tabKeyTwo}
        version={version}
      ></CityDrawerSet>
      {/* 编辑弹窗 */}
      <AppSetList
        tabKey={tabKey}
        tabKeyTwo={tabKeyTwo}
        visible={visibleConfigure}
        onClose={() => setVisibleConfigure(false)}
        childRef={childRef}
      ></AppSetList>
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
  cityList: sysAppList.cityList,
  loading: loading.models.sysAppList,
}))(CityTable);
