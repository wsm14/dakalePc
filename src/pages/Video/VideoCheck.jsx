import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import {
  VIDEO_TYPE,
  VIDEO_ACTION_TYPE,
  GOODS_CHECK_RESSTATUS,
  SUBMIT_TYPE_VIDEO,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import NoCheck from './components/VideoCheck/NoCheck';
import NoConfirm from './components/VideoCheck/NoConfirm';
import AlCheck from './components/VideoCheck/AlCheck';
import AlConfirm from './components/VideoCheck/AlConfirm';
import VideoCheckDetail from './components/VideoCheck/VideoCheckDetail';
import { checkCityName } from '@/utils/utils';

const tabList = [
  {
    key: 'adminAudit',
    tab: '待审核',
  },
  {
    key: 'merchantAudit',
    tab: '待确认',
  },
  {
    key: 'adminConfirmed',
    tab: '已审核',
  },
  {
    key: 'merchantConfirmed',
    tab: '已确认',
  },
];

const VideoCheck = (props) => {
  const tableRef = useRef();
  const { dispatch, videoCheck } = props;
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [tabkey, setTabKey] = useState('adminAudit');
  const { list } = videoCheck;

  const fetchVideoCheckClose = (record) => {
    const { auditIdString, ownerIdString } = record;
    dispatch({
      type: 'specialGoodsCheck/fetchSpecialGoodsAuditClose',
      payload: {
        ownerId: ownerIdString,
        auditId: auditIdString,
      },
      callback: () => {
        tableRef.current.fetchGetData();
      },
    });
  };

  //组建公用的搜索条件
  const globalSearch = [
    {
      label: '分享内容',
      name: 'marketingName',
    },
    {
      label: '集团/店铺名',
      name: 'ownerId',
      type: 'merchant',
    },

    {
      label: '创建人',
      name: 'submitterUserName',
    },
    {
      label: '审核创建时间',
      type: 'rangePicker',
      name: 'createBeginDate',
      end: 'createEndDate',
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '店铺类型/视频类型',
      name: 'ownerType',
      type: 'select',
      select: VIDEO_TYPE,
    },
    {
      label: '审核类型',
      name: 'actionType',
      type: 'select',
      select: VIDEO_ACTION_TYPE,
    },
  ];

  //tab自组件Table公用的colum数据部分
  const globalColum = [
    {
      title: '视频/内容详情',
      fixed: 'left',
      dataIndex: 'momentDTO',
      width: 280,
      render: (val, row) => {
        const { momentDTO = {} } = row;
        return (
          <PopImgShow url={momentDTO.frontImage}>
            <Ellipsis length={8} tooltip lines={1}>
              {momentDTO.message}
            </Ellipsis>
          </PopImgShow>
        );
      },
    },
    {
      title: '店铺/集团',
      dataIndex: 'userType',
      width: 320,
      render: (val, row) => {
        const { momentDTO = {} } = row;
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Tag>{VIDEO_TYPE[momentDTO.ownerType]}</Tag>
              <Ellipsis length={15} tooltip>
                {momentDTO.ownerName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Tag color="blue">{`${momentDTO.topCategoryName}-${momentDTO.categoryName}`}</Tag>
              <span>{checkCityName(momentDTO.districtCode)}</span>
            </div>
          </>
        );
      },
    },
    {
      title: '视频类型',
      align: 'right',
      dataIndex: 'momentDTO',
      show: tabkey === 'adminAudit',
      render: (val, row) => {
        const { momentDTO = {} } = row;
        return (
          <>
            {VIDEO_TYPE[momentDTO.ownerType]}
            {momentDTO.ownerType ? '视频' : '-'}
          </>
        );
      },
    },
    // {
    //   title: '单次打赏卡豆数',
    //   align: 'right',
    //   dataIndex: 'beanAmount',
    //   render: (val, row) => {
    //     const { momentDTO = {} } = row;
    //     return <>{momentDTO.beanAmount}</>;
    //   },
    // },
    {
      title: '审核创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{val}</div>
          <div>
            {SUBMIT_TYPE_VIDEO[record.submitterType]}--{record.submitterUserName}
          </div>
        </div>
      ),
    },
    {
      title: '确认时间',
      align: 'center',
      dataIndex: 'submitTime',
      show: tabkey === 'merchantConfirmed', // 审核已确认
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      show: ['adminConfirmed'].includes(tabkey),
    },
    // {
    //   title: '审核对象',
    //   align: 'center',
    //   dataIndex: 'submitterType',
    //   show: ['adminConfirmed'].includes(tabkey), //已审核
    // },
    {
      title: '审核类型',
      align: 'center',
      dataIndex: 'actionType',
      render: (val) => VIDEO_ACTION_TYPE[val],
    },
    {
      title: '审核结果',
      dataIndex: 'auditStatus',
      render: (val) => GOODS_CHECK_RESSTATUS[val],
      show: ['adminConfirmed', 'merchantConfirmed'].includes(tabkey),
    },
    {
      title: '驳回原因',
      dataIndex: 'rejectReason',
      show: ['adminConfirmed', 'merchantConfirmed'].includes(tabkey),
    },
    {
      type: 'handle',
      dataIndex: 'auditIdString',
      render: (val, record, index) => {
        const { auditStatus } = record;
        return [
          {
            type: 'info',
            title: '详情',
            click: () => fetchVideoCheckDetail(index, 'info'),
            visible: tabkey !== 'adminAudit',
          },
          {
            type: 'check',
            title: '审核',
            click: () => fetchVideoCheckDetail(index, 'check'),
            visible: tabkey === 'adminAudit',
          },
          {
            type: 'close',
            title: '关闭', //驳回状态可以关闭
            visible: auditStatus === '2',
            click: () => fetchVideoCheckClose(record),
          },
        ];
      },
    },
  ];

  const listProps = { tableRef, tabkey, globalColum, globalSearch };

  const contentList = {
    adminAudit: <NoCheck {...listProps}></NoCheck>,
    merchantAudit: <NoConfirm {...listProps}></NoConfirm>,
    adminConfirmed: <AlCheck {...listProps}></AlCheck>,
    merchantConfirmed: <AlConfirm {...listProps}></AlConfirm>,
  };

  // 获取详情
  const fetchVideoCheckDetail = (index, type) => {
    const { ownerIdString, auditIdString, auditStatus: status, submitterType } = list[index];
    dispatch({
      type: 'videoCheck/fetchAuditMomentDetail',
      payload: { ownerId: ownerIdString, auditId: auditIdString, type },
      callback: (val) => {
        const newProps = {
          show: true,
          detail: { ...val },
        };
        setVisibleInfo({
          status,
          index,
          ...newProps,
          ownerIdString,
          auditIdString,
          submitterType,
        });
      },
    });
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
      {/* 详情 */}
      <VideoCheckDetail
        visible={visibleInfo}
        total={list.length}
        tabkey={tabkey}
        cRef={tableRef}
        getDetail={fetchVideoCheckDetail}
        onClose={() => setVisibleInfo(false)}
      ></VideoCheckDetail>
    </>
  );
};
export default connect(({ videoCheck }) => ({
  videoCheck,
}))(VideoCheck);
