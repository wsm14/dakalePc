import React, { useState } from 'react';
import { PAY_TYPE, ORDER_TYPE, ORDER_STATUS } from '@/common/constant';
import { connect } from 'umi';
import { Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import { DownOutlined } from '@ant-design/icons';
import { checkCityName } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import QuestionTooltip from '@/components/QuestionTooltip';
import OrderRefund from './OrderRefund';
import styles from './style.less';

const OrderDetailDraw = (props) => {
  const { visible, onClose, getDetail, childRef, total, tabkey, loading, dispatch } = props;
  const { detail = {}, show = false, index } = visible;
  const { status, closeType, divisionParam = {} } = detail;

  const [isShow, setIsShow] = useState(true);
  const [isShow1, setIsShow1] = useState(true);
  const [refund, setRefund] = useState(true);

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

  const userFormItem = [
    {
      label: '用户昵称',
      name: ['userInfo', 'userName'],
      span: 2,
    },
    {
      label: '豆号',
      name: ['userInfo', 'beanCode'],
    },
    {
      label: '联系电话',
      name: ['userInfo', 'mobile'],
    },
    {
      label: '收货信息',
      name: 'orderLogisticInfo',
      show: tabkey === 'commerceGoods',
      render: (val) => {
        return (
          <div>
            {`${val?.addressName || '--'}，${val?.mobile || '--'}，${checkCityName(
              val?.districtCode,
            )}，${val?.address}，${val?.postalCode}`}
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
  //供应商信息
  const supplierItem = [
    {
      label: '供应商名称 ',
      name: ['supplierInfo', 'supplierName'],
      span: 2,
    },
    {
      label: '供应商ID',
      name: ['supplierInfo', 'supplierId'],
    },
    {
      label: '供应商地址',
      name: ['supplierInfo', 'supplierAddress'],
      span: 3,
    },
    {
      label: '供应商类型',
      name: ['supplierInfo', 'supplierType'],
      span: 3,
      render: (val) =>
        ({
          1: '对公',
          2: '对私',
        }[val]),
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
      render: (val) => ORDER_TYPE[val],
    },
    // {
    //   label: '交易来源',
    //   name: 'orderSource',
    //   render: (val) => USER_SOURCE[val],
    // },
    {
      label: '现金支付渠道',
      name: 'payType',
      render: (val) => PAY_TYPE[val],
    },
    {
      label: '付款编号',
      name: 'paySn',
      show: orderStatusCheck || (status === '2' && orderCloseStatusCheck),
    },
    {
      label: '取消原因',
      name: 'closeReason',
      span: 2,
      show: status === '2' && ['unpaidManualCancel', 'unpaidExpiredCancel'].includes(closeType),
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
    footer: detail.status === '1' && tabkey != 'communityGoods' && (
      <Button
        type="primary"
        onClick={() => {
          const { userId, orderId, orderSn } = detail;
          setRefund({
            show: true,
            detail: {
              userId,
              orderId,
              orderSn,
              orderType: tabkey,
              payFee: detail.payFee,
            },
          });
        }}
      >
        退款
      </Button>
    ),
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        <DescriptionsCondition
          title="用户信息"
          labelStyle={{ width: 120 }}
          formItems={userFormItem}
          initialValues={detail}
          column={2}
        ></DescriptionsCondition>
        {tabkey !== 'communityGoods' && tabkey !== 'commerceGoods' && (
          <DescriptionsCondition
            title="商家信息"
            labelStyle={{ width: 120 }}
            formItems={merchartItem}
            column={2}
            initialValues={detail}
          ></DescriptionsCondition>
        )}
        {tabkey === 'commerceGoods' && (
          <DescriptionsCondition
            title="供应商信息"
            labelStyle={{ width: 120 }}
            formItems={supplierItem}
            column={3}
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
          {tabkey !== 'communityGoods' && (
            <div>
              <DescriptionsCondition
                formItems={orderImgItem}
                initialValues={detail}
              ></DescriptionsCondition>
            </div>
          )}
          <div>
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span>订单金额</span>
              <span>{detail.totalFee ? `￥${detail.totalFee}` : 0}</span>
            </div>
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span onClick={() => handleShow('sale')}>
                优惠合计 <DownOutlined />
              </span>
              <span>
                {detail.deductFeeObject ? `￥${detail.deductFeeObject[0].reduceFee}` : `￥0`}
              </span>
            </div>
            {isShow && (
              <div>
                <div className={styles.detail_last_div}>
                  <span>抵扣券</span>
                  <span>{detail.reduceFee ? `￥${detail.reduceFee}` : 0}</span>
                </div>
                <div className={styles.detail_last_div}>
                  <span>平台券</span>
                  <span>
                    {detail.deductFeeObject ? `￥${detail.deductFeeObject[0].reduceFee}` : `￥0`}
                  </span>
                </div>
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
                  <span>{PAY_TYPE[detail.payType] || '支付'}</span>
                  <span>{detail.payFee ? `￥${detail.payFee}` : 0}</span>
                </div>
              </>
            )}
            {tabkey !== 'communityGoods' && (
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
                  {`${(
                    Number(divisionParam?.commission) + Number(divisionParam?.darenBean / 100)
                  ).toFixed(2)}`}
                  (含{divisionParam?.beanCommission}卡豆)
                </span>
              </div>
            )}

            {tabkey !== 'communityGoods' && (
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
            )}
            {['2'][detail.status] && orderCloseStatusCheck && (
              <div className={styles.detail_last_div} style={{ color: '#333' }}>
                <span>退款金额</span>
                <span>{detail.payFee ? `￥${detail.payFee}` : 0}</span>
              </div>
            )}
            <div className={styles.detail_last_div} style={{ color: '#333' }}>
              <span>订单状态</span>
              <span>
                {['2'][detail.status]
                  ? orderCloseStatusCheck
                    ? '交易关闭（退款成功）'
                    : '交易关闭（订单超时/手动取消）'
                  : ORDER_STATUS[detail.status]}
              </span>
            </div>
          </div>
        </div>
      </DrawerCondition>
      {/* 退款 */}
      <OrderRefund
        visible={refund}
        getDetail={() => {
          childRef.current.fetchGetData();
          getDetail(index);
        }}
        onClose={() => setRefund(false)}
      ></OrderRefund>
    </>
  );
};

export default connect()(OrderDetailDraw);
