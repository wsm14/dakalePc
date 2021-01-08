import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { BANNER_SHOW_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import SysAppSetForm from './components/App/SysAppSet';

const PuzzleAd = (props) => {
  const { sysAppList, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' });

  // 搜索参数
  const searchItems = [
    {
      label: '品牌名',
      name: 'bannerType',
    },
    // {
    //   label: '区域',
    //   name: 'city',
    //   type: 'cascader',
    //   valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    // },
  ];

  // table 表头
  const getColumns = [
    {
      title: '类型',
      dataIndex: 'coverImg',
    },
    {
      title: '品牌名',
      align: 'center',
      dataIndex: 'description',
    },
    {
      title: '说明',
      align: 'center',
      dataIndex: 'bannerType',
    },
    {
      title: '品牌名',
      align: 'center',
      dataIndex: 'jumpType',
      render: (val) => val || '无',
    },
    {
      title: '展示时间',
      align: 'center',
      dataIndex: 'jumpUrl',
      render: (val) => val || '--',
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
              type: 'eye',
              visible: record.showStatus === '1',
              click: () => fetchBannerStatusDel({ bannerId: val, bannerStatus: 0 }),
            },
            {
              type: 'up',
              visible: record.showStatus === '1',
              click: () => fetchBannerStatusDel({ bannerId: val, bannerStatus: 0 }),
            },
            {
              type: 'down',
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

  // 下架
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
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              onClick={() => setVisibleSet({ show: true, info: '' })}
            >
              新增
            </Button>
          </AuthConsumer>
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
}))(PuzzleAd);
