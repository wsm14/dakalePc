import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button, Space } from 'antd';
import { OPEN_ADVERT_PORT, BANNER_SHOW_STATUS, BANNER_JUMP_TYPE } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import OpenAdSet from './components/OpenAd/OpenAdSet';

const OpenAdvert = (props) => {
  const { sysAppList, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' });
  const [tabKey, setTabKey] = useState('user');

  // 搜索参数
  const searchItems = [
    {
      label: '广告主',
      name: 'bannspe',
    },
    {
      label: '状态',
      name: 'showStatus',
      type: 'select',
      select: BANNER_SHOW_STATUS,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'begsinDate',
      end: 'enddDate',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '广告主名',
      fixed: 'left',
      dataIndex: 'coverImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '广告内容',
      align: 'center',
      dataIndex: 'description',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '广告说明',
      align: 'center',
      dataIndex: 'bannerType',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '点击事件',
      align: 'center',
      dataIndex: 'jumpType',
      render: (val) => (val ? BANNER_JUMP_TYPE[val] : '无'),
    },
    {
      title: '跳转内容',
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
      title: '补贴卡豆',
      align: 'right',
      dataIndex: 'showStsatus',
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
      width: 165,
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'down',
              visible: record.showStatus === '1',
              click: () => fetchBannerStatusDel({ bannerId: val, bannerStatus: 0 }),
            },
            {
              type: 'againUp',
              visible: record.showStatus === '1',
              click: () => fetchBannerStatusDel({ bannerId: val, bannerStatus: 0 }),
            },
            {
              type: 'info',
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
          tabList: Object.keys(OPEN_ADVERT_PORT).map((key) => ({
            key,
            tab: OPEN_ADVERT_PORT[key],
          })),
          tabBarExtraContent: (
            <Space>
              <AuthConsumer auth="save">
                <Button
                  className="dkl_green_btn"
                  onClick={() => setVisibleSet({ show: true, type: 'add' })}
                >
                  新增
                </Button>
              </AuthConsumer>
              <AuthConsumer auth="adRoot">
                <Button type="primary" onClick={() => setVisibleSet({ show: true, type: 'add' })}>
                  配置
                </Button>
              </AuthConsumer>
            </Space>
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
      <OpenAdSet
        tabKey={tabKey}
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></OpenAdSet>
    </>
  );
};

export default connect(({ sysAppList, loading }) => ({
  sysAppList,
  loading: loading.models.sysAppList,
}))(OpenAdvert);
