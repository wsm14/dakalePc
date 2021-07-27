import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { OPEN_ADVERT_PORT, BANNER_SHOW_STATUS, BANNER_JUMP_TYPE } from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import OpenAdSet from './components/OpenAd/OpenAdSet';

const OpenAdvert = (props) => {
  const { openAdvert, loading, dispatch } = props;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [visibleSet, setVisibleSet] = useState({ show: false, detail: '' });
  const [tabKey, setTabKey] = useState('user');

  // 搜索参数
  const searchItems = [
    {
      label: '广告主',
      name: 'launchOwner',
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: BANNER_SHOW_STATUS,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'beginTime',
      end: 'endTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '广告主名',
      fixed: 'left',
      dataIndex: 'launchOwner',
    },
    {
      title: '广告内容',
      align: 'center',
      dataIndex: 'url',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '广告说明',
      align: 'center',
      dataIndex: 'launchDesc',
      ellipsis: true,
    },
    {
      title: '点击事件',
      align: 'center',
      dataIndex: 'jumpUrlType',
      render: (val) => BANNER_JUMP_TYPE[val],
    },
    {
      title: '跳转内容',
      align: 'center',
      dataIndex: 'jumpUrl',
      render: (val, row) => {
        const { jumpUrlType, nativeJumpName } = row;
        return { H5: val, inside: nativeJumpName, '': '--' }[jumpUrlType];
      },
    },
    {
      title: '展示时间',
      align: 'center',
      dataIndex: 'startDate',
      render: (val, record) => `${val} ~ ${record.endDate}`,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => BANNER_SHOW_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'idString',
      render: (appLaunchImageId, record) => [
        {
          type: 'info',
          click: () => fetchOpenAdvertDetail({ appLaunchImageId }, 'info'),
        },
        {
          type: 'edit',
          visible: record.status === '1',
          click: () => fetchOpenAdvertDetail({ appLaunchImageId }, 'edit'),
        },
        {
          type: 'down',
          visible: record.onFlag === '1',
          click: () => fetchOpenAdvertStatus({ appLaunchImageId, onFlag: 0 }),
        },
        {
          type: 'del',
          visible: record.onFlag === '0',
          click: () => fetchOpenAdvertStatus({ appLaunchImageId, deleteFlag: 0 }),
        },
      ],
    },
  ];

  // 获取详情
  const fetchOpenAdvertDetail = (payload, type) => {
    dispatch({
      type: 'openAdvert/fetchOpenAdvertDetail',
      payload,
      callback: (detail) => setVisibleSet({ show: true, type, detail }),
    });
  };

  // 下架 删除
  const fetchOpenAdvertStatus = (payload) => {
    dispatch({
      type: 'openAdvert/fetchOpenAdvertStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 权限按钮
  const btnList = [{ onClick: () => setVisibleSet({ show: true, type: 'add' }) }]; // 新增按钮

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        searchForm={form}
        cardProps={{
          tabList: Object.keys(OPEN_ADVERT_PORT).map((key) => ({
            key,
            tab: OPEN_ADVERT_PORT[key],
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
        rowKey={(record) => `${record.idString}`}
        dispatchType="openAdvert/fetchGetList"
        {...openAdvert}
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

export default connect(({ openAdvert, loading }) => ({
  openAdvert,
  loading: loading.models.openAdvert,
}))(OpenAdvert);
