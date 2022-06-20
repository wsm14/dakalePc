import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Badge, Avatar } from 'antd';
import {
  ORDER_STATUS,
  SPECIAL_GOODS_TYPE,
  ORDER_CLOSE_TYPE,
  ORDER_PAY_LOGO,
  GOODS_CLASS_TYPE,
  BUSINESS_TYPE,
} from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import coupon from '@public/coupon.png';
import styles from '../style.less';

const GoodsOrders = (props) => {
  const { ordersList, loading, loadings, dispatch, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '商品名称',
      name: 'goodsId',
      type: 'good',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '店铺/集团',
      name: 'merchantId',
      type: 'merchant',
    },
    {
      label: '订单属性',
      type: 'select',
      name: 'goodsClass',
      allItem: false,
      select: SPECIAL_GOODS_TYPE,
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      allItem: false,
      select: ORDER_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品主图',
      dataIndex: ['orderDesc', 'specialGoods'],
      render: (val, row) => (
        <Badge.Ribbon text={SPECIAL_GOODS_TYPE[row.goodsClass]} color="cyan" placement="start">
          <PopImgShow url={val?.goodsImg || coupon} />
        </Badge.Ribbon>
      ),
    },
    {
      title: '商品名称/订单号',
      dataIndex: ['orderDesc', 'specialGoods'],
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* {row.goodsType && row.goodsType !== 'reduce' && (
              <Tag color="magenta">{GOODS_CLASS_TYPE[row.goodsType]}</Tag>
            )} */}
            <Ellipsis length={12} tooltip>
              {val?.goodsName}
            </Ellipsis>
          </div>
          <div style={{ marginTop: 5 }} className={styles.specFont}>
            {row.orderSn}
          </div>
        </div>
      ),
    },
    {
      title: '所属店铺/地区',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">{BUSINESS_TYPE[row.relateOwnerType]}</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div className={styles.specFont}>{checkCityName(row.districtCode)}</div>
        </div>
      ),
    },
    {
      title: '下单人',
      align: 'center',
      dataIndex: 'userInfo',
      render: (val, row) => `${val?.userName}\n${val?.mobile}\n${val?.beanCode}`,
    },
    {
      title: '单价/数量',
      align: 'center',
      dataIndex: ['orderDesc', 'specialGoods'],
      render: (val, row) => {
        // const num = Number(val?.sellPrice || 0) + Number(val?.sellBean || 0) / 100;

        return (
          <div>
            <div>{`￥${val?.realPrice || 0}`}</div>
            <div>{`×${row?.goodsCount || 0}`}</div>
          </div>
        );
      },
    },
    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'payFee',
      render: (val, record) => {
        const cashBean = record.beanFee ? record.beanFee / 100 : 0;
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${Number(val) + cashBean > 0 ? (Number(val) + cashBean).toFixed(2) : 0}`}</div>
            <div className={styles.fontColor}>
              {record.beanFee ? `(${record.beanFee}卡豆` : '(' + '0卡豆'}
            </div>
            <div className={styles.fontColor}>{(val ? `+ ￥${val}` : 0) + ')'}</div>
          </div>
        );
      },
    },
    {
      title: '平台券',
      align: 'center',
      dataIndex: 'deductFeeObject',
      render: (val) =>
        val ? (
          <>
            <div>{`${val[0]?.reduceFee || 0}元${val[0]?.deductTypeName || ''}`}</div>
            <div>{val[0]?.platformCouponId || ''}</div>
          </>
        ) : (
          '-'
        ),
    },
    {
      title: '商户实收',
      align: 'center',
      dataIndex: 'settleParam',
      render: (val, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${val?.settlePrice || 0}`}</div>
          </div>
        );
      },
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'divisionParam',
      render: (val, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${val?.commission || 0}`}</div>
          </div>
        );
      },
    },
    {
      title: '下单/核销时间',
      dataIndex: 'createTime',
      align: 'center',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>{val}</div>
          <div className={styles.fontColor}>
            已核销：<a href="">查看</a>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => (
        <>
          <span style={{ display: 'inline-flex', marginBottom: 5 }}>
            <div>
              <div>{ORDER_STATUS[val]}</div>
              {['2'].includes(val) && <div>{`（${ORDER_CLOSE_TYPE[row.closeType]}）`}</div>}
            </div>
            <Avatar
              src={ORDER_PAY_LOGO[row.orderSource]}
              size="small"
              shape="square"
              style={{ marginLeft: 5 }}
            />
          </span>
        </>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'orderId',
      render: (val, record, index) => [
        {
          type: 'info',
          click: () => fetchGoodsDetail(index),
        },
      ],
    },
  ];

  //详情
  const fetchGoodsDetail = (index) => {
    const { orderId, userId } = list[index];
    dispatch({
      type: 'ordersList/fetchGetOrderDetail',
      payload: { orderId, userId },
      callback: (detail) => {
        setVisible({
          index,
          show: true,
          detail,
        });
      },
    });
  };

  return (
    <>
      <TableDataBlock
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ orderType: tabkey }}
        rowKey={(record) => `${record.orderId}`}
        dispatchType="ordersList/fetchPageListOrdersList"
        {...ordersList}
      ></TableDataBlock>
      <OrderDetailDraw
        childRef={childRef}
        visible={visible}
        total={list.length}
        tabkey={tabkey}
        loading={loadings.effects['ordersList/fetchGetOrderDetail']}
        onClose={() => setVisible(false)}
        getDetail={fetchGoodsDetail}
      ></OrderDetailDraw>
    </>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  hubData: baseData.hubData,
  loading: loading.models.ordersList,
}))(GoodsOrders);
