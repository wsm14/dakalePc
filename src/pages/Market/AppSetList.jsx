import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tooltip, Form } from 'antd';
import {
  BANNER_LOOK_AREA,
  BANNER_PORT_TYPE,
  BANNER_JUMP_TYPE,
  BANNER_AREA_TYPE,
  BANNER_SHOW_STATUS,
} from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import SysAppSetForm from './components/App/SysAppSet';
import AddImgplace from './components/App/AddImgplace';

const SysAppSet = (props) => {
  const { sysAppList, bannerTypeObj, loading, dispatch } = props;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' });
  const [tabKey, setTabKey] = useState('user');
  const [visibleAddImg, setVisibleAddImg] = useState(false); // 新增位置

  useEffect(() => {
    fetchBannerRatio();
  }, [tabKey]);

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
      align: 'right',
      dataIndex: 'weight',
    },
    {
      title: '位置',
      align: 'center',
      dataIndex: 'bannerType',
      render: (val) => bannerTypeObj[val],
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
          type: 'down',
          visible: record.bannerStatus === '1',
          click: () => fetchBannerStatus({ bannerId: val, bannerStatus: 0 }),
        },
        {
          type: 'up',
          visible: record.bannerStatus === '0',
          click: () => fetchBannerStatus({ bannerId: val, bannerStatus: 1 }),
        },
        {
          type: 'edit',
          click: () => fetchBannerDetail({ bannerId: val }),
        },
        {
          type: 'del',
          visible: record.bannerStatus === '0',
          click: () => fetchBannerStatus({ bannerId: val, deleteFlag: 0 }),
        },
      ],
    },
  ];

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
      callback: childRef.current.fetchGetData,
    });
  };

  const btnList = [
    {
      text: '新增位置',
      auth: 'addPlace',
      onClick: () => setVisibleAddImg(true),
    },
    {
      onClick: () => {
        const type = tabKey === 'mark' ? 'markMain' : null;
        setVisibleSet({
          show: true,
          type: 'add',
          detail: { visibleRange: 'user,kol', bannerType: type },
        });
      },
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
      {/* 新增 */}
      <SysAppSetForm
        bannerTypeObj={bannerTypeObj}
        tabKey={tabKey}
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></SysAppSetForm>
      {/* 新增图片位置 */}
      <AddImgplace
        tabKey={tabKey}
        visible={visibleAddImg}
        onClose={() => setVisibleAddImg(false)}
      ></AddImgplace>
    </>
  );
};

export default connect(({ sysAppList, loading }) => ({
  sysAppList: sysAppList.list,
  bannerTypeObj: sysAppList.bannerTypeObj,
  loading: loading.models.sysAppList,
}))(SysAppSet);
