import React, { useState } from 'react';
import { PAY_TYPE, VERIFICATION_STATUS, ORDER_TYPE_PROPS, USER_SOURCE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import styles from './style.less';
import QuestionTooltip from '@/components/QuestionTooltip';
import { DownOutlined } from '@ant-design/icons';

const OrderDetailDraw = (props) => {
  const { visible, onClose, getDetail, total, tabkey, loading } = props;
  const { detail = {}, show = false, index } = visible;
  const { status, closeType, orderGoodsVerifications = [] } = detail;
  const [isShow, setIsShow] = useState(true);
  const [isShow1, setIsShow1] = useState(true);

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

  const couponItem = (item) => [
    {
      label: '券码',
      name: 'verificationCode',
    },
    // 0：未核销，1：已核销 2：已过期 3-申请退款中 4-关闭
    {
      label: '核销号',
      name: 'orderGoodsVerificationId',
      show: item.status === '1',
    },
    {
      name: 'status',
      render: (val) => `订单${VERIFICATION_STATUS[val]}`,
      show: item.status !== '1',
    },
    {
      label: '核销时间',
      name: 'verificationTime',
      show: item.status === '1',
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
      render: (val, row) => `${row.merchantProvince}-${row.merchantCity}-${row.merchantDistrict}`,
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

  //订单信息
  const orderItem = [
    {
      label: '订单号',
      name: 'orderSn',
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
      label: '支付方式',
      name: 'payType',
      render: (val) => PAY_TYPE[val],
      show: orderStatusCheck || (status === '2' && orderCloseStatusCheck),
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
      render: (val) => <div style={{ textAlign: 'center' }}>单价{val ? `￥${val}` : '0'}</div>,
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
  };
  return (
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
      <DescriptionsCondition
        title="用户信息"
        formItems={userFormItem}
        initialValues={detail}
        column={2}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="商家信息"
        formItems={merchartItem}
        column={2}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="订单信息"
        formItems={orderItem}
        initialValues={detail}
        column={2}
      ></DescriptionsCondition>

      {status === '6' ||
        (status === '2' && orderCloseStatusCheck && (
          <DescriptionsCondition
            title="退款信息"
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
              ￥{detail.cashCommission}({detail.beanCommission}卡豆)
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
            <span>{`￥${detail.actualCashFee}
            (${detail.actualBeanFee ? detail.actualBeanFee : 0}卡豆)`}</span>
          </div>
        </div>
      </div>
    </DrawerCondition>
  );
};
export default OrderDetailDraw;
