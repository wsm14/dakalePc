import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Tooltip } from 'antd';
import {
  BANNER_TYPE,
  BANNER_PORT_TYPE,
  BANNER_SHOW_STATUS,
  BANNER_JUMP_TYPE,
  BANNER_AREA_TYPE,
} from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import SysAppSetForm from './components/App/SysAppSet';

const SysAppSet = (props) => {
  const { sysAppList, loading, dispatch } = props;

  const childRef = useRef();
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
      select: BANNER_TYPE,
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
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '位置',
      align: 'center',
      dataIndex: 'bannerType',
      render: (val) => (BANNER_TYPE[val] ? BANNER_TYPE[val] : '--'),
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
      dataIndex: 'jumpType',
      render: (val) => (val ? BANNER_JUMP_TYPE[val] : '无'),
    },
    {
      title: '跳转链接',
      align: 'center',
      dataIndex: 'jumpUrl',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '展示时间',
      align: 'center',
      dataIndex: 'beginDate',
      render: (val, record) => `${val} ~ ${record.endDate}`,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'beginDate',
      render: (val, record) => `${val} ~ ${record.endDate}`,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'showStatus',
      render: (val) => BANNER_SHOW_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'bannerIdString',
      align: 'right',
      fixed: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'down',
              visible: record.showStatus === '1',
              click: () => fetchBannerStatusDel({ bannerId: val, bannerStatus: 0 }),
            },
            {
              type: 'edit',
              visible: record.showStatus !== '2',
              click: () => fetchBannerDetail({ bannerId: val }),
            },
            {
              type: 'del',
              visible: record.showStatus !== '2',
              click: () => fetchBannerStatusDel({ bannerId: val, deleteFlag: 0 }),
            },
          ]}
        />
      ),
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

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        cardProps={{
          tabList: Object.keys(BANNER_PORT_TYPE).map((key) => ({
            key,
            tab: BANNER_PORT_TYPE[key],
          })),
          tabBarExtraContent: (
            <AuthConsumer auth="save">
              <Button
                className="dkl_green_btn"
                onClick={() => setVisibleSet({ show: true, type: 'add' })}
              >
                新增
              </Button>
            </AuthConsumer>
          ),
          onTabChange: (key) => {
            setTabKey(key);
            childRef.current.fetchGetData({ key, page: 1 });
          },
        }}
        params={{ key: tabKey }}
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
