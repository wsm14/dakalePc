import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import MarketCardActivitySetStore from './MarketCardActivitySetStore';
import MarketCardActivitySetCoupon from './MarketCardActivitySetCoupon';

// 搜索参数
const searchItems = [
  {
    label: '商家名称',
    name: 'dates',
  },
];

const MarketCardActivityDetail = (props) => {
  const { marketCardActivity, loading, dispatch, params, setShow } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '商家名称',
      align: 'center',
      dataIndex: 'startDate',
    },
    {
      title: '所在城市',
      align: 'center',
      dataIndex: 'signBeanAmount',
    },
    {
      title: '所在区域',
      align: 'center',
      dataIndex: 'signAmount',
    },
    {
      title: '详细地址',
      align: 'center',
      dataIndex: 'totalBeanAmount',
    },
    {
      title: '活动商品',
      align: 'center',
      dataIndex: 'targetUserAmount',
    },
    {
      title: '原价',
      align: 'center',
      dataIndex: 'status',
    },
    {
      title: '活动价',
      align: 'center',
      dataIndex: 'stastus',
    },
    {
      title: '活动数量',
      align: 'center',
      dataIndex: 'statsus',
    },
    {
      title: '已售',
      align: 'center',
      dataIndex: 'staatus',
      render: (val) => val || 0,
    },
    {
      title: '已核销',
      align: 'center',
      dataIndex: 'staatuss',
      render: (val) => val || 0,
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'id',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '核销明细',
            },
            {
              type: 'own',
              title: '订单明细',
            },
            {
              type: 'own',
              title: '优惠券',
              click: () => handleSetActive('coupon'),
            },
          ]}
        />
      ),
    },
  ];

  const setprops = { dispatch, childRef };

  // 设置 活动商家 | 优惠券
  const handleSetActive = (type) => {
    dispatch({
      type: 'drawerForm/show',
      payload: {
        store: MarketCardActivitySetStore(setprops),
        coupon: MarketCardActivitySetCoupon(setprops),
      }[type],
    });
  };

  // 头部添加面包屑 按钮
  const handlePageShowBtn = () => {
    dispatch({
      type: 'global/saveTitle',
      payload: {
        pageTitle: [params.name],
        pageBtn: (
          <Button className="dkl_orange_btn" onClick={handlePageBtnBack}>
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
    <Button className="dkl_green_btn" key="1" onClick={() => handleSetActive('store')}>
      新增
    </Button>
  );

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      btnExtra={btnExtra}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.startDate}`}
      params={{ id: params.id }}
      dispatchType="marketCardActivity/fetchGetActiveDetail"
      {...marketCardActivity}
    ></DataTableBlock>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading: loading.models.marketCardActivity,
}))(MarketCardActivityDetail);
