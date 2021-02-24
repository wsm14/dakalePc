import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import MarketCardActivitySetStore from './MarketCardActivitySetStore';
import MarketCardActivitySetCoupon from './MarketCardActivitySetCoupon';
import MarketCardActivityDetailPay from './MarketCardActivityDetailPay';

// 搜索参数
const searchItems = [
  {
    label: '商家名称',
    name: 'merchantName',
  },
];

const MarketCardActivityDetail = (props) => {
  const { marketCardActivity, loading, dispatch, params, setShow } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');
  const [visibleSet, setVisibleSet] = useState(false);

  const loadings =
    loading.effects['marketCardActivity/fetchGetActiveDetail'] ||
    loading.effects['marketCardActivity/fetchGetCouponInfo'];

  // table 表头
  const getColumns = [
    {
      title: '活动商品',
      align: 'center',
      fixed: 'left',
      dataIndex: 'goodsName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '商家名称',
      align: 'center',
      fixed: 'left',
      dataIndex: 'merchantName',
    },
    {
      title: '所在城市',
      align: 'center',
      dataIndex: 'merchantCity',
    },
    {
      title: '所在区域',
      align: 'center',
      dataIndex: 'merchantDistrict',
    },
    {
      title: '详细地址',
      align: 'center',
      dataIndex: 'merchantAddress',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '原价',
      align: 'center',
      dataIndex: 'originPrice',
    },
    {
      title: '活动价',
      align: 'center',
      dataIndex: 'currentPrice',
    },
    {
      title: '活动数量',
      align: 'center',
      dataIndex: 'totalCount',
    },
    {
      title: '已售',
      align: 'center',
      dataIndex: 'soldCount',
      render: (val) => val || 0,
    },
    {
      title: '已核销',
      align: 'center',
      dataIndex: 'verifiedCount',
      render: (val) => val || 0,
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'marketCouponIdString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '核销明细',
              auth: 'destoryDetail',
              click: () => setVisible({ type: 'destory', record }),
            },
            {
              type: 'own',
              title: '订单明细',
              auth: 'orderDetail',
              click: () => setVisible({ type: 'order', record }),
            },
            {
              type: 'own',
              title: '优惠券',
              auth: 'couponDetail',
              click: () => fetchGetCouponInfo(val, record.merchantName),
            },
          ]}
        />
      ),
    },
  ];

  // 获取优惠券详情status != 2 表示活动上架 可添加
  const fetchGetCouponInfo = (marketCouponId, merchantName) => {
    dispatch({
      type: 'marketCardActivity/fetchGetCouponInfo',
      payload: {
        marketCouponId,
        merchantName,
        status: params.activityStatus !== '2',
        activityId: params.activityIdString,
      },
      callback: handleSetActive,
    });
  };

  // 设置/查看 优惠券
  const handleSetActive = (payload) => {
    const obj = { dispatch, childRef, payload };
    dispatch({
      type: 'drawerForm/show',
      payload: MarketCardActivitySetCoupon(obj),
    });
  };

  // 头部添加面包屑 按钮
  const handlePageShowBtn = () => {
    dispatch({
      type: 'global/saveTitle',
      payload: {
        pageTitle: [params.activityName],
        pageBtn: [
          <Button type="danger" key="btn" onClick={handlePageBtnBack}>
            返回
          </Button>,
        ],
      },
    });
  };

  // 头部添加按钮返回
  const handlePageBtnBack = () => {
    setShow({ key: 'home' });
    dispatch({
      type: 'global/closeTitle',
    });
  };

  useEffect(() => {
    dispatch({
      type: 'marketCardActivity/clearDetailPay',
    });
  }, [visible]);

  useEffect(() => {
    handlePageShowBtn();
  }, []);

  const btnExtra = (
    <AuthConsumer auth="couponAdd">
      <Button className="dkl_green_btn" key="1" onClick={() => setVisibleSet(true)}>
        新增
      </Button>
    </AuthConsumer>
  );

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loadings}
        btnExtra={params.activityStatus !== '2' && btnExtra}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => record.marketCouponIdString}
        params={{ activityId: params.activityIdString }}
        dispatchType="marketCardActivity/fetchGetActiveDetail"
        {...marketCardActivity.detail}
      ></TableDataBlock>
      <MarketCardActivityDetailPay visible={visible} setVisible={setVisible} />
      <MarketCardActivitySetStore
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
        storeId={params.activityIdString}
      ></MarketCardActivitySetStore>
    </>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading,
}))(MarketCardActivityDetail);
