import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { MARKET_NOTICE_STATUS } from '@/common/constant';
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
      name: 'userMobile1',
      type: 'select',
      select: { list: [1, 2] },
    },
    {
      label: '状态',
      name: 'usesrMobile1',
      type: 'select',
      select: { list: [1, 2] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '占位图',
      dataIndex: 'userId',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '图片说明',
      align: 'center',
      dataIndex: 'phoneNumber',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '位置',
      align: 'center',
      dataIndex: 'orderCount',
    },
    {
      title: '跳转类型',
      align: 'center',
      dataIndex: 'orderTotal',
    },
    {
      title: '跳转链接',
      align: 'center',
      dataIndex: 'orderaTsotal',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '展示时间',
      align: 'center',
      dataIndex: 'orderasdTotal',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'ordsderTotal',
      render: (val) => MARKET_NOTICE_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              pop: true,
              title: '下架',
              visible: record.activityStatus !== '2',
              click: () => fetchBannerStatus({ activityId: val }),
            },
            {
              type: 'edit',
              click: () => fetchBannerDetail(record),
            },
            {
              type: 'del',
              click: () => fetchBannerDel(record),
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
  const fetchBannerStatus = (payload) => {
    dispatch({
      type: 'sysAppList/fetchBannerStatus',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 占位图删除
  const fetchBannerDel = (payload) => {
    dispatch({
      type: 'sysAppList/fetchBannerDel',
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
        rowKey={(record) => `${record.userId}`}
        dispatchType="sysAppList/fetchGetList"
        {...sysAppList}
        list={[{ name: 1 }]}
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
