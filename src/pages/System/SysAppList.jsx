import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { BANNER_STATUS, BANNER_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import SysAppSetForm from './components/App/SysAppSet';

const SysAppSet = (props) => {
  const { sysAppList, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' });

  // 搜索参数
  const searchItems = [
    {
      label: '位置',
      name: 'bannerType',
      type: 'select',
      select: { list: BANNER_TYPE },
    },
    {
      label: '状态',
      name: 'bannerStatus',
      type: 'select',
      select: { list: BANNER_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '占位图',
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
      render: (val) => BANNER_TYPE.filter((item) => item.value === val)[0].name,
    },
    {
      title: '跳转类型',
      align: 'center',
      dataIndex: 'jumpType',
    },
    {
      title: '跳转链接',
      align: 'center',
      dataIndex: 'jumpUrl',
      render: (val) => val || '--',
    },
    {
      title: '展示时间',
      align: 'center',
      dataIndex: 'beginDate',
      render: (val, record) => `${val} ~ ${record.endDate}`,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'bannerStatus',
      render: (val) => BANNER_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'bannerIdString',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              pop: true,
              title: '下架',
              visible: record.activityStatus !== '2',
              click: () => fetchBannerStatusDel({ bannerIdString: val, bannerStatus: 0 }),
            },
            {
              type: 'edit',
              visible: record.activityStatus !== '2',
              click: () => fetchBannerDetail(record),
            },
            {
              type: 'del',
              visible: record.activityStatus !== '2',
              click: () => fetchBannerStatusDel({ bannerIdString: val, deleteFlag: 0 }),
            },
          ]}
        />
      ),
    },
  ];

  // 获取图片详情
  const fetchBannerDetail = (payload) => {
    dispatch({
      type: 'sysAppList/fetchBannerDetail',
      payload,
      callback: (info) => setVisibleSet({ show: true, info }),
    });
  };

  // 占位图下架
  const fetchBannerStatusDel = (payload) => {
    dispatch({
      type: 'sysAppList/fetchBannerStatusDel',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        btnExtra={
          <Button className="dkl_green_btn" onClick={() => setVisibleSet({ show: true, info: '' })}>
            新增
          </Button>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.bannerIdString}`}
        dispatchType="sysAppList/fetchGetList"
        {...sysAppList}
      ></DataTableBlock>
      <SysAppSetForm
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false, info: '' })}
      ></SysAppSetForm>
    </>
  );
};

export default connect(({ sysAppList, loading }) => ({
  sysAppList,
  loading: loading.models.sysAppList,
}))(SysAppSet);
