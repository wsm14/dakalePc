import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tooltip, Form, Modal } from 'antd';
import {
  BANNER_LOOK_AREA,
  BANNER_JUMP_TYPE,
  BANNER_AREA_TYPE,
  BANNER_SHOW_STATUS,
} from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import SysAppSetForm from './SysAppSet';

const AppSetList = (props) => {
  const {
    visible,
    onClose,
    tabKey,
    tabKeyTwo,
    version,
    configureList,
    bannerTypeObj,
    loading,
    dispatch,
  } = props;

  const { show, detail = {} } = visible;
  const childRef = useRef();
  const [form] = Form.useForm();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' });

  // 搜索参数
  const searchItems = [
    {
      label: '位置',
      name: 'bannerType',
      type: 'select',
      select: bannerTypeObj,
    },
    {
      label: '状态',
      name: 'bannerStatus',
      type: 'select',
      select: BANNER_SHOW_STATUS,
    },
    // {
    //   label: '投放区域',
    //   name: 'shoswStatus',
    //   type: 'select',
    //   select: BANNER_AREA_TYPE,
    // },
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
      align: 'right',
      dataIndex: 'weight',
    },
    {
      title: '位置',
      align: 'center',
      dataIndex: 'bannerType',
      render: (val) => bannerTypeObj[val],
    },
    // {
    //   title: '可见范围',
    //   dataIndex: 'visibleRange',
    //   render: (val) => BANNER_LOOK_AREA[val],
    // },
    // {
    //   title: '投放区域',
    //   align: 'center',
    //   dataIndex: 'deliveryAreaType',
    //   render: (val, row) =>
    //     ({
    //       all: BANNER_AREA_TYPE[val],
    //       detail: <Tooltip title={row.deliveryAreaNameStr}>按区县({row.deliveryAreaNum})</Tooltip>,
    //     }[val]),
    // },
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
      title: '活动时间',
      align: 'center',
      dataIndex: 'beginDate',
      render: (val, row) => `${val || ''}~${row.endDate || ''}`,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'bannerStatus',
      render: (val) => BANNER_SHOW_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'bannerIdString',
      render: (val, record) => [
        {
          type: 'bannerDown',
          title: '下架',
          visible: record.bannerStatus === '1',
          click: () => fetchBannerStatus({ bannerIdString: val, bannerStatus: 0 }),
        },
        {
          title: '上架',
          type: 'bannerUp',
          visible: record.bannerStatus === '0',
          // click: () => fetchBannerStatus({ bannerId: val, bannerStatus: 1 }),
          click: () => fetchBannerDetail({ bannerIdString: val, type: 'up' }),
        },
        {
          title: '编辑',
          type: 'bannerEdit',
          click: () => fetchBannerDetail({ bannerIdString: val, type: 'edit' }),
        },
        {
          title: '删除',
          type: 'bannerDel',
          visible: record.bannerStatus === '0',
          click: () => fetchBannerStatus({ bannerIdString: val, deleteFlag: 0 }),
        },
      ],
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
  const fetchBannerStatus = (payload) => {
    dispatch({
      type: 'sysAppList/fetchBannerStatus',
      payload,
      callback: childRef?.current?.fetchGetData,
    });
  };

  const btnList = [
    {
      text: '新增',
      auth: 'bannerAdd',
      onClick: () => {
        const type = tabKey === 'mark' ? 'markMain' : null;
        setVisibleSet({
          show: true,
          type: 'add',
          detail: { ...detail, visibleRange: 'user,kol', bannerType: type },
        });
      },
    },
  ];

  const modalProps = {
    title: 'banner配置',
    visible: show,
    onCancel: onClose,
    width: 1000,
    maskClosable: true,
    footer: false,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
  };

  return (
    <>
      <Modal destroyOnClose {...modalProps} loading={loading}>
        <TableDataBlock
          noCard={false}
          cRef={childRef}
          searchForm={form}
          btnExtra={btnList}
          params={{
            ...detail,
            userType: tabKey,
            userOs: tabKeyTwo,
            version,
            isAutomatic: 0,
          }}
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          rowKey={(record) => `${record.bannerIdString}`}
          dispatchType="sysAppList/fetchGetConfigureList"
          {...configureList}
        ></TableDataBlock>
      </Modal>
      {/* 新增 */}
      <SysAppSetForm
        bannerTypeObj={bannerTypeObj}
        tabKey={tabKey}
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></SysAppSetForm>
    </>
  );
};

export default connect(({ sysAppList, loading }) => ({
  configureList: sysAppList.configureList,
  bannerTypeObj: sysAppList.bannerTypeObj,
  loading: loading.models.sysAppList,
}))(AppSetList);
