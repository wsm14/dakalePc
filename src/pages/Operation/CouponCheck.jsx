import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import { BUSINESS_TYPE, SUBMIT_TYPE, ACTION_TYPE } from '@/common/constant';

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
  const { dispatch, specialGoodsCheck } = props;
  const [tabkey, setTabKey] = useState('adminAudit');
  const [visibleInfo, setVisibleInfo] = useState(false);

  const tableRef = useRef();
  const { list } = specialGoodsCheck;

  //组建公用的搜索条件
  const globalSearch = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '集团/店铺名称',
      name: 'ownerName',
    },

    {
      label: '创建人',
      name: 'creator',
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
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
      dataIndex: 'couponName',
      render: (val, row) => (
        <div>
          <div>
            <Tag color="magenta">{COUPON_TYPE[row.couponType]}</Tag>
            {val}
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
            <Ellipsis length={10} tooltip>
              {row.ownerName}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '券价值/售价',
      align: 'right',
      dataIndex: ['reduceObject', 'couponPrice'],
      render: (val, row) => (
        <div>
          <div style={{ textDecoration: 'line-through', color: '#999999' }}>
            ￥{Number(val).toFixed(2)}
          </div>
          <div>￥{Number(row.buyPrice).toFixed(2)}</div>
        </div>
      ),
    },
    {
      title: '使用门槛',
      align: 'center',
      dataIndex: ['reduceObject', 'thresholdPrice'],
      render: (val) => (val === '0' || !val ? '无门槛' : `满${val}元可使用`),
    },
    {
      title: '使用有效期',
      dataIndex: 'activeDate',
      render: (val, row) => {
        const { activeDate, endDate, delayDays, activeDays } = row;
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
    },
    {
      title: '审核类型',
      align: 'center',
      dataIndex: 'checkType',
    },
  ];

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
            //   click: () => fetchSpecialGoodsDetail(index, 'info'),
            visible: tabkey !== 'adminAudit',
          },
          {
            type: 'check',
            title: '审核',
            //   click: () => fetchSpecialGoodsDetail(index, 'check'),
            visible: tabkey === 'adminAudit',
          },
          {
            type: 'close',
            title: '关闭', //驳回状态可以关闭
            //   visible: tabkey === 'merchantConfirmed' && auditStatus === '2',
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
  const fetchSpecialGoodsDetail = (index, type) => {
    const { ownerIdString, auditIdString, auditStatus: status } = list[index];
    dispatch({
      type: 'specialGoodsCheck/fetchSpecialGoodsAuditDetail',
      payload: { ownerId: ownerIdString, auditId: auditIdString, type },
      callback: (val) => {
        const newProps = {
          show: true,
          detail: { ...val },
        };
        if (type == 'info' || type === 'check') {
          setVisibleInfo({ status, index, ...newProps, ownerIdString, auditIdString });
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
      {/* <CouponDetail
        visible={visibleInfo}
        total={list.length}
        tabkey={tabkey}
        cRef={tableRef}
        getDetail={fetchSpecialGoodsDetail}
        onClose={() => setVisibleInfo(false)}
      ></CouponDetail> */}
    </>
  );
};
export default connect(({ specialGoodsCheck }) => ({
  specialGoodsCheck,
}))(CouponCheck);
