import React, { useState } from 'react';
import {
  PAY_TYPE,
  VERIFICATION_STATUS,
  ORDER_TYPE_PROPS,
  USER_SOURCE,
  ORDERS_STATUS,
} from '@/common/constant';
import { connect } from 'umi';
import { Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { checkCityName } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import QuestionTooltip from '@/components/QuestionTooltip';
import OrderRefund from './OrderRefund';
import OrderJournal from './OrderJournal';
import styles from './style.less';

const OrderDetailDraw = (props) => {
  const { visible, onClose, getDetail, childRef, total, tabkey, loading, dispatch } = props;
  const { detail = {}, show = false, index } = visible;
  const {
    status,
    closeType,
    orderGoodsVerifications = [],
    organizationGoodsOrderDescObject = {},
    orderLogistics = {},
  } = detail;
  const { communityGoodsList = [] } = organizationGoodsOrderDescObject; //核销明细
  const [isShow, setIsShow] = useState(true);
  const [isShow1, setIsShow1] = useState(true);
  const [refund, setRefund] = useState(true);
  const [journal, setJournal] = useState(false);

  // 订单状态检查内容显示
  /* 订单状态0-待支付；1-已支付待核销；2-订单关闭 3-交易完成 4-已确认，5-预支付 6-退款中 */
  /* closeType :  unpaidExpiredCancel: '待付款超时自动关闭',
     unpaidManualCancel: '订单已取消',
     expiredRefund: '订单已过期，订单自动过期', //过期退款
     manualRefund: '已退款成功，申请退款成功',  */
  const orderStatusCheck = ['1', '3', '4', '6'].includes(status);
  const orderCloseStatusCheck = ['expiredRefund', 'manualRefund'].includes(closeType);

  const handleShow = (type) => {
    switch (type) {
      case 'sale':
        setIsShow(!isShow);
        break;
      case 'user':
        setIsShow1(!isShow1);
        break;
    }
  };

  const getJournal = () => {
    const { orderId } = detail;
    dispatch({
      type: 'ordersList/fetchOrdersListActionLog',
      payload: { page: 1, limit: 10, type: 'order', orderId },
      callback: (detail) => {
        setJournal({ show: true, detail });
      },
    });
  };

  const couponItem = (item) => [
    {
      label: '券码',
      name: 'userCouponId',
      render: (val, row) => {
        const names = val.substring(0, 6) + '****' + val.substring(val.length - 4, val.length);
        return <span>{row.status !== '1' ? names : row.userCouponId}</span>;
      },
    },
    // 0：未核销，1：已核销 2：已过期 3-申请退款中 4-关闭
    {
      label: '核销号',
      name: 'verificationCode',
      show: item.verificationCode,
    },
    {
      label: '状态',
      name: 'status',
      render: (val) => VERIFICATION_STATUS[val],
    },
    {
      label: '核销时间',
      name: 'verificationTime',
      show: item.status === '1',
      span: 3,
    },
  ];
  const writeOffDetail = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '核销数',
      name: 'goodsCount',
      render: (val, row) => val - row?.remainCount,
    },
  ];
  const userFormItem = [
    {
      label: '用户昵称',
      name: 'userName',
      span: 2,
    },
    {
      label: '豆号',
      name: 'beanCode',
    },
    {
      label: '联系电话',
      name: 'userMobile',
    },
    {
      label: '收货信息',
      name: 'address',
      show: tabkey === 'commerceGoods',
      render: () => {
        return (
          <div>
            {`${orderLogistics?.addressName || '--'}，${
              orderLogistics?.mobile || '--'
            }，${checkCityName(orderLogistics?.districtCode)}${orderLogistics?.address}，${
              orderLogistics?.logisticsCode
            }`}
            <Button type="link" onClick={getJournal}>
              日志
            </Button>
          </div>
        );
      },
    },
  ];
  //店铺信息
  const merchartItem = [
    {
      label: '店铺名称 ',
      name: 'merchantName',
    },
    {
      label: '店铺账号',
      name: 'merchantMobile',
    },
    {
      label: '店铺地址',
      name: 'merchantProvince',
      span: 2,
      render: (val, row) => checkCityName(row.merchantDistrict),
    },
    {
      label: '营业时间',
      name: 'businessTime',
      span: 2,
      show: tabkey === 'goods',
    },
    {
      label: '店铺类型',
      name: 'address',
      render: () => '单店',
      span: 2,
    },
    // {
    //   label: '集团名称',
    //   name: 'groupName',
    // },
  ];
  //团长信息
  const relateOwnerInfo = [
    {
      label: '团长昵称 ',
      name: 'organizationGoodsOrderDescObject',
      span: 2,
      render: (val) => val?.relateOwnerName,
    },
    {
      label: '团长豆号',
      name: 'relateOwnerBeanCode',
    },
    {
      label: '团长联系电话',
      name: 'relateOwnerMobile',
    },
    {
      label: '自提点',
      name: 'organizationGoodsOrderDescObject',
      span: 2,
      render: (val) => val?.liftingAddress,
    },
  ];
  //订单信息
  const orderItem = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '团购信息标题',
      name: 'organizationGoodsOrderDescObject',
      show: tabkey === 'communityGoods',
      render: (val) => val?.title,
    },
    {
      label: '订单类型',
      name: 'orderType',
      render: (val) => ORDER_TYPE_PROPS[val],
    },
    {
      label: '交易来源',
      name: 'orderSource',
      render: (val) => USER_SOURCE[val],
    },
    {
      label: '现金支付渠道',
      name: 'payType',
      render: (val) => PAY_TYPE[val],
      show: orderStatusCheck || (status === '2' && orderCloseStatusCheck),
    },
    {
      label: '付款编号',
      name: 'paySn',
      show: orderStatusCheck || (status === '2' && orderCloseStatusCheck),
    },
    {
      label: '有效期',
      name: 'useStartTime',
      span: 2,
      render: (val, row) => `${val}-${row.useEndTime}`,
      show: tabkey === 'goods',
    },
    {
      label: '取消原因',
      name: 'closeReason',
      span: 2,
      show:
        status === '0' ||
        (status === '2' && ['unpaidManualCancel', 'unpaidExpiredCancel'].includes(closeType)),
    },
  ];

  const refundItem = [
    {
      label: '退款原因',
      name: 'refundReason',
    },
  ];

  const orderImgItem = [
    {
      name: 'goodsImg',
      type: 'upload',
    },
    {
      name: 'realPrice',
      render: (val) => <div style={{ textAlign: 'center' }}>单价：{val ? `￥${val}` : '0'}</div>,
    },
    {
      name: 'goodsCount',
      render: (val) => <div style={{ textAlign: 'center' }}>数量：{val}</div>,
      show: tabkey === 'goods',
    },
  ];

  const modalProps = {
    title: '订单详情',
    visible: show,
    onClose,
    width: 960,
    loading,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size),
    },
    footer: (detail.status === '1' ||
      (tabkey === 'communityGoods' && (detail.status === '1' || detail.status === '3'))) && (
      <Button
        type="primary"
        onClick={() =>
          setRefund({
            show: true,
            detail: {
              userId: detail.userIdString,
              orderSn: detail.orderSn,
            },
          })
        }
      >
        退款
      </Button>
    ),
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        <div className={styles.order_detail_cons}>
          <div className={styles.item_detail_con}>
            <span className={styles.orderDetail_span}>创建时间</span>
            <span>{detail.createTime}</span>
          </div>
          {(orderStatusCheck || (status === '2' && orderCloseStatusCheck)) && (
            <>
              <div className={styles.lineClass_con}></div>
              <div className={styles.item_detail_con}>
                <span className={styles.orderDetail_span}>支付时间</span>
                <span>{detail.payTime}</span>
              </div>
            </>
          )}

          {status === '2' &&
            (closeType === 'unpaidManualCancel' || closeType === 'unpaidExpiredCancel') && (
              <>
                <div className={styles.lineClass_con}></div>
                <div className={styles.item_detail_con}>
                  <span className={styles.orderDetail_span}>取消时间</span>
                  <span>{detail.closeTime}</span>
                </div>
              </>
            )}
          <div className={styles.lineClass_con}></div>
          <div className={styles.item_detail_con}>
            <span className={styles.orderDetail_span}>{ORDERS_STATUS[status]}</span>
          </div>
        </div>
        {(orderStatusCheck || (status === '2' && orderCloseStatusCheck)) && (
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '50px' }}>券码</div>
        )}
        {orderGoodsVerifications.map((item) => (
          <DescriptionsCondition
            labelStyle={{ width: 100 }}
            key={item.orderGoodsVerificationId}
            formItems={couponItem(item)}
            initialValues={item}
            column={3}
          ></DescriptionsCondition>
        ))}
        {tabkey === 'communityGoods' && (
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '50px' }}>核销明细</div>
        )}
        {tabkey === 'communityGoods' &&
          communityGoodsList.map((item, index) => (
            <DescriptionsCondition
              labelStyle={{ width: 100 }}
              key={`${item?.communityOrganizationGoodsId}${index}`}
              formItems={writeOffDetail}
              initialValues={item}
              column={3}
            ></DescriptionsCondition>
          ))}
        <DescriptionsCondition
          title="用户信息"
          labelStyle={{ width: 120 }}
          formItems={userFormItem}
          initialValues={detail}
          column={2}
        ></DescriptionsCondition>
        <DescriptionsCondition
          title="商家信息"
          labelStyle={{ width: 120 }}
          formItems={merchartItem}
          column={2}
          initialValues={detail}
        ></DescriptionsCondition>
        {tabkey === 'communityGoods' && (
          <DescriptionsCondition
            title="团长信息"
            labelStyle={{ width: 120 }}
            formItems={relateOwnerInfo}
            column={2}
            initialValues={detail}
          ></DescriptionsCondition>
        )}
        <DescriptionsCondition
          title="订单信息"
          labelStyle={{ width: 120 }}
          formItems={orderItem}
          initialValues={detail}
          column={2}
        ></DescriptionsCondition>

        {status === '6' ||
          (status === '2' && orderCloseStatusCheck && (
            <DescriptionsCondition
              title="退款信息"
              labelStyle={{ width: 120 }}
              formItems={refundItem}
              initialValues={detail}
            ></DescriptionsCondition>
          ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            borderTop: '1px solid #999',
            margin: '30px 0',
            paddingTop: 30,
          }}
        >
          <div>
            <DescriptionsCondition
              formItems={orderImgItem}
              initialValues={detail}
            ></DescriptionsCondition>
          </div>
          <div>
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span>订单金额</span>
              <span>{detail.totalFee ? `￥${detail.totalFee}` : 0}</span>
            </div>
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span onClick={() => handleShow('sale')}>
                优惠合计 <DownOutlined />
              </span>
              <span>{detail.reduceFee ? `￥${detail.reduceFee}` : 0}</span>
            </div>
            {isShow && (
              <div className={styles.detail_last_div}>
                <span>抵扣券</span>
                <span>{detail.reduceFee ? `￥${detail.reduceFee}` : 0}</span>
              </div>
            )}
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span onClick={() => handleShow('user')}>
                <QuestionTooltip
                  title="用户实付"
                  content="用户实际支付的金额，包含卡豆和现金金额，等于订单金额减去优惠的金额；"
                  type="quest"
                ></QuestionTooltip>
                <DownOutlined />
              </span>
              <span>{`￥${
                Number(detail.payFee) + (detail.beanFee ? detail.beanFee / 100 : 0) > 0
                  ? (Number(detail.payFee) + (detail.beanFee ? detail.beanFee / 100 : 0)).toFixed(2)
                  : 0
              }(含${detail.beanFee ? detail.beanFee : 0}卡豆)`}</span>
            </div>
            {isShow1 && (
              <>
                <div className={styles.detail_last_div}>
                  <span>卡豆</span>
                  <span>
                    {detail.beanFee ? `￥${detail.beanFee / 100}（含${detail.beanFee}卡豆）` : 0}
                  </span>
                </div>
                <div className={styles.detail_last_div}>
                  <span>{PAY_TYPE[detail.payType] || '支付宝'}</span>
                  <span>{detail.payFee ? `￥${detail.payFee}` : 0}</span>
                </div>
              </>
            )}
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span>
                <QuestionTooltip
                  title="平台服务费"
                  content="交易成功后平台所收取的服务费"
                  type="quest"
                ></QuestionTooltip>
              </span>

              <span>
                ￥
                {`${(Number(detail.cashCommission) + Number(detail.beanCommission / 100)).toFixed(
                  2,
                )}`}
                (含{detail.beanCommission}卡豆)
                {/* ￥{detail.cashCommission}({detail.beanCommission}卡豆) */}
              </span>
            </div>
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span>
                <QuestionTooltip
                  title="商户实收"
                  content="商家实际收到的金额，包含卡豆和现金金额"
                  type="quest"
                ></QuestionTooltip>
              </span>
              <span>
                ￥
                {`${(Number(detail.actualCashFee) + Number(detail.actualBeanFee / 100)).toFixed(
                  2,
                )}`}
                (含{detail.actualBeanFee}卡豆)
                {/* {`￥${detail.actualCashFee}
            (${detail.actualBeanFee ? detail.actualBeanFee : 0}卡豆)`} */}
              </span>
            </div>
          </div>
        </div>
      </DrawerCondition>
      <OrderRefund
        visible={refund}
        getDetail={() => {
          childRef.current.fetchGetData();
          getDetail(index);
        }}
        onClose={() => setRefund(false)}
      ></OrderRefund>
      <OrderJournal visible={journal} onClose={() => setJournal(false)} />
    </>
  );
};

export default connect()(OrderDetailDraw);
