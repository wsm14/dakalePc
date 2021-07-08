import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tooltip, Form } from 'antd';
import {
  BANNER_LOOK_AREA,
  BANNER_PORT_TYPE,
  BANNER_PORT_LINK,
  BANNER_JUMP_TYPE,
  BANNER_AREA_TYPE,
  BANNER_SHOW_STATUS,
} from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import SysAppSetForm from './components/App/SysAppSet';

const SysAppSet = (props) => {
  const { sysAppList, loading, dispatch } = props;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' });
  const [tabKey, setTabKey] = useState('user');

  useEffect(() => {
    fetchBannerRatio();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '位置',
      name: 'bannerType',
      type: 'select',
      select: BANNER_PORT_LINK[tabKey],
    },
    {
      label: '状态',
      name: 'showStatus',
      type: 'select',
      select: BANNER_SHOW_STATUS,
    },
    {
      label: '投放区域',
      name: 'shoswStatus',
      type: 'select',
      select: BANNER_AREA_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '占位图',
      fixed: 'left',
      dataIndex: 'coverImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '图片说明',
      align: 'center',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '权重',
      name: 'weight',
      align: 'right',
    },
    {
      title: '位置',
      align: 'center',
      dataIndex: 'bannerType',
      render: (val) => BANNER_PORT_LINK[tabKey][val],
    },
    {
      title: '可见范围',
      dataIndex: 'visibleRange',
      render: (val) => BANNER_LOOK_AREA[val],
    },
    {
      title: '投放区域',
      align: 'center',
      dataIndex: 'deliveryAreaType',
      render: (val, row) =>
        ({
          all: BANNER_AREA_TYPE[val],
          detail: <Tooltip title={row.deliveryAreaNameStr}>按区县({row.deliveryAreaNum})</Tooltip>,
        }[val]),
    },
    {
      title: '跳转类型',
      align: 'center',
      dataIndex: 'jumpUrlType',
      render: (val) => BANNER_JUMP_TYPE[val],
    },
    {
      title: '跳转内容',
      align: 'center',
      dataIndex: 'jumpUrl',
      ellipsis: true,
      render: (val, row) => {
        const { jumpUrlType, nativeJumpName } = row;
        return {
          H5: val,
          inside: nativeJumpName,
          '': '--',
        }[jumpUrlType];
      },
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'showStatus',
      render: (val) => BANNER_SHOW_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'bannerIdString',
      render: (val, record) => [
        {
          type: 'down',
          click: () => fetchBannerStatusDel({ bannerId: val, bannerStatus: 0 }),
        },
        {
          type: 'edit',
          click: () => fetchBannerDetail({ bannerId: val }),
        },
        {
          type: 'del',
          click: () => fetchBannerStatusDel({ bannerId: val, deleteFlag: 0 }),
        },
      ],
    },
  ];

  // 获取banner分辨率配置
  const fetchBannerRatio = () => {
    dispatch({
      type: 'sysAppList/fetchBannerRatio',
    });
  };

  // 获取详情
  const fetchBannerDetail = (payload) => {
    dispatch({
      type: 'sysAppList/fetchBannerDetail',
      payload,
      callback: (detail) => setVisibleSet({ show: true, type: 'edit', detail }),
    });
  };

  // 占位图下架
  const fetchBannerStatusDel = (payload) => {
    dispatch({
      type: 'sysAppList/fetchBannerStatusDel',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  const btnList = [
    {
      onClick: () =>
        setVisibleSet({ show: true, type: 'add', detail: { visibleRange: 'user,kol' } }),
    },
  ];

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        searchForm={form}
        cardProps={{
          tabList: Object.keys(BANNER_PORT_TYPE).map((key) => ({
            key,
            tab: BANNER_PORT_TYPE[key],
          })),
          tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
          onTabChange: (userType) => {
            setTabKey(userType);
            form.resetFields();
            childRef.current.fetchGetData({ userType, page: 1 });
          },
        }}
        params={{ userType: tabKey }}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.bannerIdString}`}
        dispatchType="sysAppList/fetchGetList"
        {...sysAppList}
      ></TableDataBlock>
      <SysAppSetForm
        tabKey={tabKey}
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></SysAppSetForm>
    </>
  );
};

export default connect(({ sysAppList, loading }) => ({
  sysAppList,
  loading: loading.models.sysAppList,
}))(SysAppSet);
