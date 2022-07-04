import React, { useState } from 'react';
import {
  PAY_TYPE,
  ORDER_TYPE_PROPS,
  ORDER_STATUS,
  BUSINESS_TYPE,
  USER_SOURCE,
  VERIFICATION_STATUS,
} from '@/common/constant';
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
  const {
    status,
    closeType,
    divisionParam = {},
    orderGoodsVerificationInfoList = [],
    organizationGoodsOrderDescObject = {},
    relateType = 'merchant',
    orderDesc = {},
  } = detail;

  const { communityGoodsList = [] } = organizationGoodsOrderDescObject; //核销明细
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

  const couponItem = (item) => [
    {
      label: '券码',
      name: 'verificationCode',
      render: (val, row) => {
        const names = val.substring(0, 6) + '****' + val.substring(val.length - 4, val.length);
        return <span>{row.status !== '1' ? names : val}</span>;
      },
    },
    // 0：未核销，1：已核销 2：已过期 3-申请退款中 4-关闭
    {
      label: '核销号',
      name: 'userCouponId',
      show: item.userCouponId,
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
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '核销数',
      align: 'center',
      dataIndex: 'goodsCount',
      render: (val, row) => val - row?.remainCount,
    },
  ];
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
            )}，${val?.address}`}
          </div>
        );
      },
    },
  ];
  //店铺信息
  const merchartItem = [
    {
      label: '店铺名称 ',
      name:
        relateType == 'merchant'
          ? ['merchantInfo', 'merchantName']
          : ['merchantGroupInfo', 'merchantGroupName'],
    },
    {
      label: '店铺账号',
      name: relateType == 'merchant' ? ['merchantInfo', 'mobile'] : ['merchantGroupInfo', 'mobile'],
    },
    {
      label: '店铺地址',
      name:
        relateType == 'merchant'
          ? ['merchantInfo', 'districtCode']
          : ['merchantGroupInfo', 'districtCode'],
      span: 2,
      render: (val, row) => checkCityName(val),
    },
    // {
    //   label: '营业时间',
    //   name: 'businessTime',
    //   span: 2,
    //   show: tabkey === 'specialGoods',
    // },
    {
      label: '店铺类型',
      name: 'relateType',
      render: (val) => BUSINESS_TYPE[val],
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
      render: (val) => ORDER_TYPE_PROPS[val],
    },
    {
      label: '交易来源',
      name: 'orderSource',
      render: (val, row) =>
        row?.orderDesc?.commerceHelpSellFlag == '1' ? '哒小团小程序-带货大厅' : USER_SOURCE[val],
    },
    {
      label: '现金支付渠道',
      name: 'payType',
      render: (val) => PAY_TYPE[val],
    },
    {
      label: '付款编号',
      name: 'paySn',
      span: 2,
      show: orderStatusCheck || (status === '2' && orderCloseStatusCheck),
    },
    {
      label: '分享帮卖',
      name: 'shareUserInfo',
      render: (val) => `${val?.userName}，${val?.mobile}，${val?.beanCode}`,
      span: 2,
      show: orderDesc?.commerceHelpSellFlag == '1',
    },
    {
      label: '取消原因',
      name: 'closeReason',
      span: 2,
      show: status === '2' && ['unpaidManualCancel', 'unpaidExpiredCancel'].includes(closeType),
    },
  ];

  //退款信息
  const refundItem = [
    {
      label: '退款原因',
      name: 'refundReason',
    },
  ];

  const orderImgItem = [
    {
      name:
        tabkey == 'specialGoods'
          ? ['orderDesc', 'specialGoods', 'goodsImg']
          : ['orderDesc', 'commerceGoods', 'goodsImg'],
      type: 'upload',
    },
    {
      name:
        tabkey == 'specialGoods' ? ['orderDesc', 'specialGoods'] : ['orderDesc', 'commerceGoods'],
      render: (val) => {
        const num = Number(val?.sellPrice || 0) + Number(val?.sellBean || 0) / 100;

        return <div style={{ textAlign: 'center' }}>单价：{`￥${num.toFixed(2)}`}</div>;
      },
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
          const { userId, orderId, orderSn, payFee, beanFee } = detail;
          setRefund({
            show: true,
            detail: {
              userId,
              orderId,
              orderSn,
              orderType: tabkey,
              payPrice: (Number(payFee || 0) + Number(beanFee || 0) / 100).toFixed(2),
              beanFee,
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
        {/* 券码 */}
        {(orderStatusCheck || (status === '2' && orderCloseStatusCheck)) &&
          tabkey !== 'communityGoods' &&
          orderGoodsVerificationInfoList.length > 0 && (
            <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '50px' }}>券码</div>
          )}
        {orderGoodsVerificationInfoList.map((item) => (
          <DescriptionsCondition
            labelStyle={{ width: 100 }}
            key={item.userCouponId}
            formItems={couponItem(item)}
            initialValues={item}
            column={3}
          ></DescriptionsCondition>
        ))}
        {/* 核销明细 */}
        {tabkey === 'communityGoods' && (
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '50px' }}>核销明细</div>
        )}
        {tabkey === 'communityGoods' && (
          <TableDataBlock
            noCard={false}
            pagination={false}
            columns={writeOffDetail}
            rowKey={(record) => `${record.communityOrganizationGoodsId}`}
            list={communityGoodsList}
            style={{ marginBottom: 10 }}
          ></TableDataBlock>
        )}
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
        {detail.refundReason && (
          <DescriptionsCondition
            title="退款信息"
            labelStyle={{ width: 120 }}
            formItems={refundItem}
            initialValues={detail}
          ></DescriptionsCondition>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
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
                {detail?.deductFee
                  ? `-￥${detail.deductFee
                      .reduce((preValue, curValue) => preValue + Number(curValue.reduceFee), 0)
                      .toFixed(2)}`
                  : `￥0`}
              </span>
            </div>
            {/* 优惠的券 */}
            {isShow && (
              <div>
                {detail?.deductFee &&
                  detail.deductFee.map((item) => {
                    return (
                      <div key={item} className={styles.detail_last_div}>
                        <span>{item.deductTypeName}</span>
                        <span>{`-￥${item.reduceFee}`}</span>
                      </div>
                    );
                  })}
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
                <span>￥{`${divisionParam?.commission || 0}`}</span>
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
                <span>{`￥${detail?.settleParam?.settlePrice || 0}`}</span>
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
