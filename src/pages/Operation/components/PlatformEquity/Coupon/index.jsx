import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { SUBMIT_TYPE, BUSINESS_TYPE, COUPON_STATUS } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import { checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import PlatformEquityDrawer from './components/PlatformEquityCoupon';
import RemainModal from './components/Detail/RemainModal';

/**
 * 权益券
 */
const PlatformEquityCoupon = (props) => {
  const { couponManage, loading, dispatch, handleGivePrize } = props;
  const { list } = couponManage;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleRemain, setVisibleRemain] = useState(false); //增加库存

  // 搜索参数
  const searchItems = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '集团/店铺名',
      name: 'relateId',
      type: 'merchant',
    },
    {
      label: '状态',
      type: 'select',
      name: 'ownerCouponStatus',
      select: COUPON_STATUS,
    },
    {
      label: '商家所属地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '店铺类型',
      name: 'relateType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '创建人',
      name: 'creatorName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '券/店铺名称',
      fixed: 'left',
      dataIndex: 'couponName',
      render: (val, row) => (
        <div>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Tag>{BUSINESS_TYPE[row.relateType]}</Tag>
            <Ellipsis length={10} tooltip>
              {row.relateName}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '券价值/售价',
      align: 'right',
      dataIndex: ['reduceObject', 'couponPrice'],
      render: (val, row) => {
        const { paymentModeObject: vals } = row;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(val).toFixed(2)}
            </div>
            <div>
              {row.buyFlag === '0' ? '免费' : `${vals.bean || 0} 卡豆 + ${vals.cash || 0} 元`}
            </div>
          </div>
        );
      },
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
      title: '剩余数量',
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '下单数量',
      align: 'right',
      dataIndex: 'total',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: '核销数量',
      align: 'right',
      dataIndex: 'verifiedCount',
      sorter: (a, b) => a.verifiedCount - b.verifiedCount,
    },
    {
      title: '商家所属地区/行业',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val, row) => `${checkCityName(val)}\n${row.topCategoryName}/${row.categoryName}`,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'ownerCouponStatus',
      render: (val, row) => COUPON_STATUS[val],
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${SUBMIT_TYPE[row.creatorType]}--${row.creatorName || ''}`,
    },
    {
      type: 'handle',
      dataIndex: 'ownerCouponIdString',
      width: 150,
      render: (ownerCouponId, record, index) => {
        const { ownerCouponStatus: status, couponName } = record; // 1 上架 2 下架
        return [
          {
            type: 'info',
            click: () => fetchCouponDetail(index, 'info'),
          },
          {
            type: 'edit',
            click: () => fetchCouponDetail(index, 'edit'),
          },
          {
            type: 'again',
            title: '重新发布',
            visible: ['2'].includes(status), // 已下架 && 未删除
            click: () => fetchCouponDetail(index, 'again'),
          },
          // 上架中 已确认 | 上架中 已驳回
          {
            type: 'down',
            visible: ['1'].includes(status),
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: { ownerCouponId },
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            type: 'givePrize',
            visible: ['1'].includes(status), // 活动中 && 未删除
            click: () =>
              handleGivePrize({
                goodsName: couponName,
                ownerCouponId,
                couponType: 'rightCoupon',
              }),
          },
          {
            title: '增加库存',
            type: 'addRemain',
            visible: ['1'].includes(status),
            click: () => fetAddRemain(ownerCouponId, record.remain),
          },
        ];
      },
    },
  ];

  // 增加库存
  const fetAddRemain = (ownerCouponId, remain) => {
    setVisibleRemain({
      show: true,
      ownerCouponId,
      remain,
    });
  };

  // 下架
  const fetchDownCoupon = (values) => {
    const { ownerCouponId } = visibleRefuse.detail;
    dispatch({
      type: 'couponManage/fetchCouponOff',
      payload: {
        ...values,
        ownerCouponId,
        ownerId: -1,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  // 获取详情
  const fetchCouponDetail = (index, type) => {
    const { ownerCouponIdString: ownerCouponId, ownerCouponStatus: status } = list[index];
    dispatch({
      type: 'couponManage/fetchCouponDetail',
      payload: { ownerCouponId, ownerId: -1, type },
      callback: (detail) =>
        setVisibleSet({ type, show: true, index, detail, ownerCouponId, status }),
    });
  };

  const btnList = [
    {
      auth: 'save',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={btnList}
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ adminFlag: 1 }}
        rowKey={(record) => `${record.ownerCouponIdString}`}
        dispatchType="couponManage/fetchGetList"
        {...couponManage}
      ></TableDataBlock>
      {/* 新增 编辑 详情*/}
      <PlatformEquityDrawer
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></PlatformEquityDrawer>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchDownCoupon}
        loading={loading}
        extra={'下架后不影响已购买的用户使用'}
      ></RefuseModal>
      {/* 库存总量 */}
      <RemainModal
        childRef={childRef}
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></RemainModal>
    </>
  );
};

export default connect(({ couponManage, loading }) => ({
  couponManage,
  loading: loading.models.couponManage,
}))(PlatformEquityCoupon);
