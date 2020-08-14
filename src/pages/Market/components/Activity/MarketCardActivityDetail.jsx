import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
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
      title: '活动商品',
      align: 'center',
      dataIndex: 'goodsName',
      render: (val) => (
        <Ellipsis length={15} tooltip>
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
              click: () => setVisible({ type: 'destory', record }),
            },
            {
              type: 'own',
              title: '订单明细',
              click: () => setVisible({ type: 'order', record }),
            },
            {
              type: 'own',
              title: '优惠券',
              click: () => fetchGetCouponInfo(val, record.merchantName),
            },
          ]}
        />
      ),
    },
  ];

  // 获取优惠券详情
  const fetchGetCouponInfo = (marketCouponId, merchantName) => {
    dispatch({
      type: 'marketCardActivity/fetchGetCouponInfo',
      payload: { marketCouponId, merchantName },
      callback: handleSetActive,
    });
  };

  // 设置/查看 优惠券
  const handleSetActive = (payload) => {
    // const payload = { initialValues: '', marketCouponId };
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
        pageBtn: (
          <Button type="danger" onClick={handlePageBtnBack}>
            返回
          </Button>
        ),
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
    handlePageShowBtn();
  }, []);

  const btnExtra = (
    <Button className="dkl_green_btn" key="1" onClick={() => setVisibleSet(true)}>
      新增
    </Button>
  );

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loadings}
        btnExtra={btnExtra}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => record.marketCouponIdString}
        params={{ activityId: params.activityIdString }}
        dispatchType="marketCardActivity/fetchGetActiveDetail"
        {...marketCardActivity.detail}
      ></DataTableBlock>
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
