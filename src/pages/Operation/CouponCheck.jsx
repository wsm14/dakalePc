import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import {
  BUSINESS_TYPE,
  SUBMIT_TYPE,
  ACTION_TYPE,
  COUPON_TYPE,
  GOODS_CHECK_RESSTATUS,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import CouponDetail from './components/CouponCheck/CouponDetail';
import TableDataBlock from '@/components/TableDataBlock';

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
  const { dispatch, couponAudit, loading } = props;
  const [tabkey, setTabKey] = useState('adminAudit');
  const [visibleInfo, setVisibleInfo] = useState(false);

  const tableRef = useRef();
  const { list } = couponAudit;

  useEffect(() => {
    tableRef.current.fetchGetData();
  }, [tabkey]);

  // 组建公用的搜索条件
  const searchItems = [
    {
      label: '券名称',
      name: 'marketingName',
    },
    {
      label: '集团/店铺名',
      name: 'ownerId',
      type: 'merchant',
    },
    {
      label: '提交人',
      name: 'submitterUserName',
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
    {
      label: '审核结果',
      name: 'auditStatus',
      type: 'select',
      show: ['merchantConfirmed', 'adminConfirmed'].includes(tabkey),
      select: GOODS_CHECK_RESSTATUS,
    },
  ];

  // tab自组件Table公用的colum数据部分
  const getColumns = [
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
              <Ellipsis length={15} tooltip>
                {ownerCouponDTO.couponName}
              </Ellipsis>
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
    {
      title: '审核时间',
      show: ['merchantConfirmed', 'adminConfirmed'].includes(tabkey),
      dataIndex: 'auditTime',
    },
    {
      title: '审核结果',
      dataIndex: 'auditStatus',
      show: ['merchantConfirmed', 'adminConfirmed'].includes(tabkey),
      render: (val) => GOODS_CHECK_RESSTATUS[val],
    },
    {
      title: '驳回原因',
      dataIndex: 'rejectReason',
      show: ['merchantConfirmed', 'adminConfirmed'].includes(tabkey),
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
            visible: auditStatus === '2',
            click: () => fetchSpecialGoodsClose(record),
          },
        ];
      },
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

  // 获取详情
  const fetchCouponDetail = (index, type) => {
    const {
      ownerIdString: ownerId,
      auditIdString: auditId,
      auditStatus: status,
      submitterType,
    } = list[index];
    dispatch({
      type: 'couponAudit/fetchCouponAuditDetail',
      payload: { auditId, ownerId, type },
      callback: (val) => {
        const newProps = {
          show: true,
          detail: { ...val },
        };
        if (type == 'info' || type === 'check') {
          setVisibleInfo({ status, index, ...newProps, ownerId, auditId, submitterType });
        } else {
          setVisibleSet({ type, ...newProps });
        }
      },
    });
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={setTabKey}>
        <TableDataBlock
          firstFetch={false}
          noCard={false}
          cRef={tableRef}
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          params={{ auditSearchType: tabkey }}
          rowKey={(record) => `${record.auditIdString}`}
          dispatchType="couponAudit/fetchGetList"
          {...couponAudit}
        ></TableDataBlock>
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
export default connect(({ couponAudit, loading }) => ({
  couponAudit,
  loading: loading.models.couponAudit || loading.effects['baseData/fetchGetLogDetail'],
}))(CouponCheck);
