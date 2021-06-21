import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { COUPON_STATUS, COUPON_TYPE, BUSINESS_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import CouponDrawer from './components/Coupon/CouponDrawer';
import excelProps from './components/Coupon/excelProps';

const CouponManageComponent = (props) => {
  const { couponManage, loading, dispatch } = props;
  const { list } = couponManage;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '集团/店铺名称',
      name: 'ownerName',
    },
    {
      label: '状态',
      type: 'select',
      name: 'merchantCouponStatus',
      select: COUPON_STATUS,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '券类型',
      type: 'select',
      name: 'couponType',
      select: COUPON_TYPE,
    },
    {
      label: '店铺类型',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '券名称',
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
      title: '创建时间',
      align: 'right',
      dataIndex: 'createTime',
    },
    {
      title: '发布时间',
      align: 'right',
      dataIndex: 'updateTime',
      render: (val, row) => (
        <div>
          {val}
          <div>{COUPON_STATUS[row.merchantCouponStatus]}</div>
        </div>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'ownerCouponIdString',
      render: (ownerCouponId, record, index) => {
        const { merchantCouponStatus: status, ownerIdString: ownerId } = record;
        return [
          {
            type: 'info',
            click: () => fetchCouponDetail(index, 'info'),
          },
          {
            type: 'del',
            visible: status !== '1',
            click: () => fetchCouponSet({ ownerCouponId, ownerId, deleteFlag: 0 }),
          },
          // {
          //   type: 'edit',
          //   click: () => fetchCouponDetail(val, 'edit'),
          // },
          // 上架中 已确认 | 上架中 已驳回
          {
            type: 'down',
            popText: `下架后不影响已购买的用户使用，\n确定下架吗？`,
            visible: status == '1',
            click: () => fetchCouponSet({ ownerCouponId, ownerId, merchantCouponStatus: 2 }),
          },
        ];
      },
    },
  ];

  // 下架/删除
  const fetchCouponSet = (payload) => {
    dispatch({
      type: 'couponManage/fetchCouponSet',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取商品详情
  const fetchCouponDetail = (index, type) => {
    const { ownerCouponIdString: ownerCouponId, ownerIdString: ownerId } = list[index];
    dispatch({
      type: 'couponManage/fetchCouponDetail',
      payload: { ownerCouponId, ownerId },
      callback: (detail) => setVisible({ type, show: true, index, detail }),
    });
  };

  // 权限按钮
  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'couponManage/fetchCouponToImport',
      data: get(),
      exportProps: excelProps,
    },
    {
      text: '新建券',
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
}))(CouponManageComponent);
