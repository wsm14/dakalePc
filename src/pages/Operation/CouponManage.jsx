import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { GOODS_TYPE, MRE_SURE_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import CouponDrawer from './components/Coupon/CouponDrawer';
import styles from './style.less';

const CouponManageComponent = (props) => {
  const { couponManage, loading, dispatch } = props;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: GOODS_TYPE,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'verifiedBeginDate',
      end: 'verifiedEndDate',
    },
    {
      label: '券类型',
      name: 'status',
      type: 'select',
      select: GOODS_TYPE,
    },
    {
      label: '优惠券名称',
      name: 'goodsName',
    },
    {
      label: '集团/店铺名称',
      name: 'goodsName',
    },
    {
      label: '投放渠道',
      name: 'goodsName',
      type: 'select',
      select: GOODS_TYPE,
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valueskey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '优惠券类型',
      dataIndex: 'goodsName',
    },
    {
      title: '优惠券名称',
      dataIndex: 'goodsUnit',
      render: (val) => val || '--',
    },
    {
      title: '券价值',
      align: 'right',
      dataIndex: 'customCategoryName',
      render: (val) => `￥${Number(val).toFixed(2)}`,
    },
    {
      title: '券售价',
      align: 'right',
      dataIndex: 'goodsType',
      render: (val) => `￥${Number(val).toFixed(2)}`,
    },
    {
      title: '店铺/集团名称',
      dataIndex: 'price',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '参与活动店铺',
      align: 'center',
      dataIndex: 'merchantName',
    },
    {
      title: '有效期',
      align: 'right',
      dataIndex: 'stock',
      render: (val) => <span className={val <= 50 ? styles.goods_rowColor : ''}>{val}</span>,
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'status',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'checkStatus',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'checkStatus',
      render: (val) => (!val ? '-' : MRE_SURE_TYPE[val]),
    },
    {
      title: '投放渠道',
      align: 'center',
      dataIndex: 'checkStatus',
      render: (val) => (!val ? '-' : MRE_SURE_TYPE[val]),
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'goodsIdString',
      render: (val, record) => {
        const { status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                click: () => setVisible({ type: 'info', show: true }),
              },
              // 上架中 已确认 | 上架中 已驳回
              {
                type: 'down',
                popText: `下架后用户无法购买，\n确定要下架吗？`,
                visible: status == 1,
                click: () => fetchCouponStatus(record),
              },
            ]}
          />
        );
      },
    },
  ];

  // 下架
  const fetchCouponStatus = (payload) => {
    dispatch({
      type: 'couponManage/fetchCouponStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取商品详情
  const fetchCouponDetail = (payload) => {
    dispatch({
      type: 'couponManage/fetchGoodsGetDetail',
      payload,
      callback: (detail) => setVisible({ type: 'info', show: true, detail }),
    });
  };

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.goodsIdString}`}
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
  loading: loading.effects['couponManage/fetchGetList'],
}))(CouponManageComponent);
