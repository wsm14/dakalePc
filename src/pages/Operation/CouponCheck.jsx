import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import { BUSINESS_TYPE, SUBMIT_TYPE, ACTION_TYPE, COUPON_TYPE } from '@/common/constant';

import Ellipsis from '@/components/Ellipsis';
import NoCheck from './components/CouponCheck/NoCheck';
import NoConfirm from './components/CouponCheck/NoConfirm';
import AlCheck from './components/CouponCheck/AlCheck';
import AlConfirm from './components/CouponCheck/AlConfirm';
import CouponDetail from './components/CouponCheck/Detail/CouponDetail';

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

const CouponCheck = (props) => {
  const { dispatch, couponAudit } = props;
  const [tabkey, setTabKey] = useState('adminAudit');
  const [visibleInfo, setVisibleInfo] = useState(false);

  const tableRef = useRef();
  const { list } = couponAudit;

  //组建公用的搜索条件
  const globalSearch = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '集团/店铺名',
      name: 'ownerId',
      type: 'merchant',
    },
    {
      label: '创建人',
      name: 'creator',
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'createBeginDate',
      end: 'createEndDate',
    },
    {
      label: '审核类型',
      name: 'actionType',
      type: 'select',
      select: ACTION_TYPE,
    },
    {
      label: '店铺类型',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
  ];

  //tab自组件Table公用的colum数据部分
  const globalColum = [
    {
      title: '券/店铺名称',
      dataIndex: 'ownerCouponDTO',
      render: (val, row) => {
        const { ownerCouponDTO = {} } = row;
        return (
          <div>
            <div>
              {ownerCouponDTO.couponType && (
                <Tag color="magenta">{COUPON_TYPE[ownerCouponDTO.couponType]}</Tag>
              )}
              {ownerCouponDTO.couponName}
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Tag>{BUSINESS_TYPE[ownerCouponDTO.ownerType]}</Tag>
              <Ellipsis length={10} tooltip>
                {ownerCouponDTO.ownerName}
              </Ellipsis>
            </div>
          </div>
        );
      },
    },
    {
      title: '券价值/售价',
      align: 'right',
      dataIndex: 'ownerCouponDTO',
      render: (val, row) => {
        const { ownerCouponDTO = {} } = row;
        const { reduceObject = {} } = ownerCouponDTO;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(reduceObject.couponPrice).toFixed(2)}
            </div>
            <div>￥{Number(ownerCouponDTO.buyPrice).toFixed(2)}</div>
          </div>
        );
      },
    },
    {
      title: '使用门槛',
      align: 'center',
      dataIndex: ['reduceObject', 'thresholdPrice'],
      render: (val, row) => {
        const { ownerCouponDTO = {} } = row;
        const { reduceObject = {} } = ownerCouponDTO;
        return reduceObject.thresholdPrice === '0' || !reduceObject.thresholdPrice
          ? '无门槛'
          : `满${reduceObject.thresholdPrice}元可使用`;
      },
    },
    {
      title: '使用有效期',
      dataIndex: 'activeDate',
      render: (val, row) => {
        const { ownerCouponDTO = {} } = row;
        const { activeDate, endDate, delayDays, activeDays } = ownerCouponDTO;
        if (activeDate && endDate) {
          return activeDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      title: '审核创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{val}</div>
          <div>
            {SUBMIT_TYPE[record.submitterType]}--{record.submitterUserName}
          </div>
        </div>
      ),
    },
    {
      title: '剩余数量',
      align: 'right',
      dataIndex: 'remain',
      render: (val, row) => {
        const { ownerCouponDTO = {} } = row;
        return ownerCouponDTO.remain;
      },
    },
    {
      title: '审核类型',
      align: 'center',
      dataIndex: 'actionType',
      render: (val) => ACTION_TYPE[val],
    },
  ];

  const fetchSpecialGoodsClose = (record) => {
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

  const rowHandle = [
    {
      type: 'handle',
      dataIndex: 'auditIdString',
      render: (val, record, index) => {
        const { auditStatus } = record;
        return [
          {
            type: 'info',
            title: '详情',
            click: () => fetchCouponDetail(index, 'info'),
            visible: tabkey !== 'adminAudit',
          },
          {
            type: 'check',
            title: '审核',
            click: () => fetchCouponDetail(index, 'check'),
            visible: tabkey === 'adminAudit',
          },
          {
            type: 'close',
            title: '关闭', //驳回状态可以关闭
            visible: tabkey === 'merchantConfirmed' && auditStatus === '2',
            click: () => fetchSpecialGoodsClose(record),
          },
        ];
      },
    },
  ];

  const listProps = { tableRef, tabkey, globalColum, globalSearch, rowHandle };
  const contentList = {
    adminAudit: <NoCheck {...listProps}></NoCheck>,
    merchantAudit: <NoConfirm {...listProps}></NoConfirm>,
    adminConfirmed: <AlCheck {...listProps}></AlCheck>,
    merchantConfirmed: <AlConfirm {...listProps}></AlConfirm>,
  };

  // 获取详情
  const fetchCouponDetail = (index, type) => {
    const { ownerIdString: ownerId, auditIdString: auditId, auditStatus: status } = list[index];
    dispatch({
      type: 'couponAudit/fetchCouponAuditDetail',
      payload: { auditId, ownerId, type },
      callback: (val) => {
        const newProps = {
          show: true,
          detail: { ...val },
        };
        if (type == 'info' || type === 'check') {
          setVisibleInfo({ status, index, ...newProps, ownerId, auditId });
        } else {
          setVisibleSet({ type, ...newProps });
        }
      },
    });
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
      {/* 详情 */}
      <CouponDetail
        visible={visibleInfo}
        total={list.length}
        tabkey={tabkey}
        cRef={tableRef}
        getDetail={fetchCouponDetail}
        onClose={() => setVisibleInfo(false)}
      ></CouponDetail>
    </>
  );
};
export default connect(({ couponAudit }) => ({
  couponAudit,
}))(CouponCheck);
