import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { COUPON_STATUS, COUPON_TYPE, BUSINESS_TYPE, SUBMIT_TYPE } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import CouponDrawer from './components/CouponManage/CouponDrawer';
import RemainModal from './components/CouponManage/Detail/RemainModal';
import { checkCityName } from '@/utils/utils';

const PlatformManage = (props) => {
  const { couponManage, loading, dispatch, loadings } = props;
  const { list } = couponManage;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  //下架原因框
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleRemain, setVisibleRemain] = useState(false); //增加库存

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      type: 'select',
      name: 'ownerCouponStatus',
      select: COUPON_STATUS,
    },
    {
      label: '适用人群',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '最后修改时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '最后修改人',
      name: 'couponName',
    },
    {
      label: '用户所属地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
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
          <div>
            <Tag color="magenta">{COUPON_TYPE[row.couponType]}</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
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
      title: '剩余数量',
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '销量',
      dataIndex: 'total',
      align: 'right',
      render: (val, row) => val - row.remain,
      sorter: (a, b) => a.total - a.remain - (b.total - b.remain),
    },
    {
      title: '核销数量',
      align: 'right',
      dataIndex: 'verifiedCount',
      sorter: (a, b) => a.verifiedCount - b.verifiedCount,
    },
    {
      title: '地区/行业',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val, row) => (
        <>
          <div> {checkCityName(val) || '--'} </div>
          <div>
            {row.topCategoryName} / {row.categoryName}
          </div>
        </>
      ),
    },
    {
      title: '创建时间',
      align: 'right',
      dataIndex: 'createTime',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{val}</div>
          <div>
            {SUBMIT_TYPE[record.creatorType]}--{record.creatorName}
          </div>
        </div>
      ),
    },
    {
      title: '发布时间',
      align: 'right',
      dataIndex: 'updateTime',
      render: (val, row) => (
        <div>
          {val}
          <div>{COUPON_STATUS[row.ownerCouponStatus]}</div>
        </div>
      ),
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'ownerCouponIdString',
      render: (ownerCouponId, record, index) => {
        // 1 上架 2 下架
        const { ownerCouponStatus: status, ownerIdString: ownerId } = record;
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
            title: '下架',
            auth: 'down',
            visible: ['1'].includes(status),
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: { ownerCouponId, ownerId },
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            title: '增加数量',
            type: 'addnum',
            visible: ['1'].includes(status),
            click: () => fetAddRemain(ownerCouponId, ownerId, record.remain),
          },
        ];
      },
    },
  ];

  // 增加库存
  const fetAddRemain = (ownerCouponId, ownerId, remain) => {
    setVisibleRemain({
      show: true,
      ownerCouponId,
      ownerId,
      remain,
    });
  };

  // 下架
  const fetchDownCoupon = (values) => {
    const { ownerCouponId, ownerId } = visibleRefuse.detail;
    dispatch({
      type: 'couponManage/fetchCouponOff',
      payload: {
        ...values,
        ownerCouponId,
        ownerId,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  // 获取详情
  const fetchCouponDetail = (index, type) => {
    const {
      ownerCouponIdString: ownerCouponId,
      ownerIdString: ownerId,
      ownerCouponStatus: status,
      ownerType,
    } = list[index];
    if (type === 'edit' && status === '1') {
      dispatch({
        type: 'specialGoods/fetchEditCurrentStatus',
        payload: {
          ownerId,
          ownerServiceId: ownerCouponId,
          ownerType,
        },
        callback: (val) => {
          if (val !== '1') {
            return;
          }
        },
      });
    }
    dispatch({
      type: 'couponManage/fetchCouponDetail',
      payload: { ownerCouponId, ownerId, type },
      callback: (detail) =>
        setVisible({ type, show: true, index, detail, ownerCouponId, ownerId, status }),
    });
  };

  // 权限按钮
  const btnList = [
    {
      text: '新增',
      auth: 'save',
      onClick: () => setVisible({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        keepData
        btnExtra={btnList}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.ownerCouponIdString}`}
        dispatchType="couponManage/fetchGetList"
        {...couponManage}
      ></TableDataBlock>
      <CouponDrawer
        childRef={childRef}
        visible={visible}
        total={list.length}
        getDetail={fetchCouponDetail}
        onClose={() => setVisible(false)}
      ></CouponDrawer>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchDownCoupon}
        loading={loadings.models.couponManage}
        extra={'下架后不影响已购买的用户使用'}
      ></RefuseModal>
      {/* 增加数量 */}
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
  loadings: loading,
  loading:
    loading.effects['couponManage/fetchGetList'] ||
    loading.effects['couponManage/fetchCouponSet'] ||
    loading.effects['couponManage/fetchCouponDetail'],
}))(PlatformManage);
