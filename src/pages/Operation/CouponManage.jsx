import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { COUPON_STATUS, COUPON_TYPE, BUSINESS_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import AuthConsumer from '@/layouts/AuthConsumer';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import CouponDrawer from './components/Coupon/CouponDrawer';

const CouponManageComponent = (props) => {
  const { couponManage, loading, dispatch } = props;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
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
      label: '优惠券名称',
      name: 'couponName',
    },
    {
      label: '集团/店铺名称',
      name: 'merchantName',
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '优惠券类型',
      dataIndex: 'couponType',
      render: (val) => COUPON_TYPE[val],
    },
    {
      title: '优惠券名称',
      dataIndex: 'couponName',
    },
    {
      title: '券价值',
      align: 'right',
      dataIndex: ['reduceObject', 'couponPrice'],
      render: (val) => `￥${Number(val).toFixed(2)}`,
    },
    {
      title: '券售价',
      align: 'right',
      dataIndex: 'buyPrice',
      render: (val) => (!val ? '免费' : `￥${Number(val).toFixed(2)}`),
    },
    {
      title: '结算价',
      align: 'right',
      dataIndex: 'goosdsType',
      render: (val) => `￥${Number(val).toFixed(2)}`,
    },
    {
      title: '使用门槛',
      align: 'right',
      dataIndex: ['reduceObject', 'thresholdPrice'],
      render: (val) => (val === '0' ? '无门槛' : `满${val}元可使用`),
    },
    {
      title: '店铺类型',
      align: 'right',
      dataIndex: 'merchantType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      title: '店铺/集团名称',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '活动店铺数',
      align: 'right',
      dataIndex: 'merchantCount',
      render: (val, row) => {
        const { ownerCouponId } = row;
        return <a onClick={() => {}}>{val}</a>;
      },
    },
    {
      title: '有效期',
      align: 'center',
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
      title: '投放总量',
      align: 'right',
      dataIndex: 'none',
    },
    {
      title: '投放总量',
      align: 'right',
      dataIndex: 'none2',
    },
    {
      title: '销量/领取量',
      align: 'right',
      dataIndex: 'none3',
    },
    {
      title: '核销数量',
      align: 'right',
      dataIndex: 'none4',
    },
    {
      title: '更新人',
      align: 'center',
      dataIndex: 'none5',
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'none6',
    },
    {
      title: '状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'merchantCouponStatus',
      render: (val) => COUPON_STATUS[val],
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'ownerCouponId',
      render: (val, record) => {
        const { merchantCouponStatus: status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                click: () => fetchCouponDetail(val, 'info'),
              },
              {
                type: 'del',
                click: () => fetchCouponSet({ ownerCouponId, deleteFlag: 0 }),
              },
              {
                type: 'edit',
                click: () => fetchCouponDetail(val, 'edit'),
              },
              // 上架中 已确认 | 上架中 已驳回
              {
                type: 'down',
                popText: `下架后不影响已购买的用户使用，\n确定下架吗？`,
                visible: status == 1,
                click: () => fetchCouponSet({ ownerCouponId, merchantCouponStatus: 2 }),
              },
            ]}
          />
        );
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
  const fetchCouponDetail = (payload, type) => {
    dispatch({
      type: 'couponManage/fetchCouponDetail',
      payload,
      callback: (detail) => setVisible({ type, show: true, detail }),
    });
  };

  return (
    <>
      <TableDataBlock
        order
        keepData
        btnExtra={
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              onClick={() => setVisible({ type: 'add', show: true })}
            >
              新建券
            </Button>
          </AuthConsumer>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.ownerCouponId}`}
        dispatchType="couponManage/fetchGetList"
        {...couponManage}
      ></TableDataBlock>
      <CouponDrawer
        childRef={childRef}
        visible={visible}
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
