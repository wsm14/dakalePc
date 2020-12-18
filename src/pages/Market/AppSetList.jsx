import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { BANNER_TYPE, BANNER_SHOW_STATUS } from '@/common/constant';
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
      name: 'showStatus',
      type: 'select',
      select: { list: BANNER_SHOW_STATUS },
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
      render: (val) =>
        BANNER_TYPE.filter((item) => item.value === val)[0]
          ? BANNER_TYPE.filter((item) => item.value === val)[0].name
          : '--',
    },
    {
      title: '跳转类型',
      align: 'center',
      dataIndex: 'jumpType',
      render: (val) => val || '无',
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
              type: 'own',
              pop: true,
              title: '下架',
              visible: record.showStatus === '1',
              click: () => fetchBannerStatusDel({ bannerId: val, bannerStatus: 0 }),
            },
            {
              type: 'edit',
              visible: record.showStatus !== '2',
              click: () => setVisibleSet({ show: true, info: record }),
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
