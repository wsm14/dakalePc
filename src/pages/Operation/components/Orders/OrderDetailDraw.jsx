import React from 'react';
import { PAY_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import styles from './style.less';
import { Collapse } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';
const { Panel } = Collapse;

const OrderDetailDraw = (props) => {
  const { visible, onClose, getDetail, total } = props;
  const { detail = {}, show = false, index } = visible;
  const { verificationTime } = detail;

  const userFormItem = [
    {
      label: '用户昵称',
      name: 'name',
      span: 2,
    },
    {
      label: '豆号',
      name: 'name',
    },
    {
      label: '联系电话',
      name: 'name',
    },
  ];

  const merchartItem = [
    {
      label: '店铺名称 ',
      name: 'merchantName',
    },
    {
      label: '店铺账号',
      name: 'address',
    },
    {
      label: '店铺地址',
      name: 'address',
      span: 2,
    },
    {
      label: '店铺类型',
      name: 'address',
    },
    {
      label: '集团名称',
      name: 'address',
    },
  ];

  const orderTiem = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '订单类型',
      name: 'orderType',
    },
    {
      label: '交易来源',
      name: 'name',
    },
    {
      label: '支付方式',
      name: 'payType',
      render: (val) => PAY_TYPE[val],
    },
    {
      label: '现金支付渠道',
      name: 'name',
    },
    {
      label: '付款编号',
      name: 'name',
    },
  ];

  const orderImgItem = [
    {
      name: 'goodsImg',
      type: 'upload',
    },
    {
      name: 'totalFee',
      render: (val) => (
        <div style={{textAlign:"center"}}>{val ? `￥${val}` : '0'}</div>
      ),
    },
  ];

  const formItems = [
    {
      label: '订单商品',
      name: 'name',
    },
    {
      label: '店铺名称 ',
      name: 'merchantName',
    },
    {
      label: '店铺地址',
      name: 'address',
    },
    {
      label: '订单金额',
      name: 'totalFee',
      render: (val) => (val ? `￥${val}` : '0'),
    },
    {
      label: '卡豆抵扣',
      name: 'beanFee',
      render: (val, row) => (
        <span>{val && val != '--' ? ` ${val}卡豆（-￥${val / 100}）` : '--'}</span>
      ),
    },
    {
      label: '优惠券',
      name: 'reduceFee',
      render: (val) => (val && val !== '--' ? `${val}元抵扣券（-￥${val || 0}）` : '--'),
    },
    {
      label: '实付金额',
      name: 'payFee',
      render: (val) => (val ? `￥${val}` : '0'),
    },
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '支付方式',
      name: 'payType',
      render: (val) => PAY_TYPE[val],
    },
    {
      label: '核销时间',
      name: 'verificationTime',
      show: verificationTime,
    },
  ];
  const modalProps = {
    title: '订单详情',
    visible: show,
    onClose,
    width: 900,
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
        <div className={styles.lineClass_con}></div>
        <div className={styles.item_detail_con}>
          <span className={styles.orderDetail_span}>支付时间</span>
          <span>{detail.payTime}</span>
        </div>
      </div>
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
        formItems={orderTiem}
        initialValues={detail}
        column={2}
      ></DescriptionsCondition>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          borderTop: '1px solid #999',
          padding: '30px 0',
        }}
      >
        <div>
          <DescriptionsCondition
            formItems={orderImgItem}
            initialValues={detail}
          ></DescriptionsCondition>
        </div>
        <div>
          <div className={styles.detail_last_div} style={{color:"#333"}}>
            <span>订单金额</span>
            <span>￥9999</span>
          </div>
          <Collapse defaultActiveKey={['1', '2','3','4']}>
            <Panel header={ <QuestionTooltip
                title='优惠合计'
                content="优惠合计"
                type="quest"
              ></QuestionTooltip>} key="1">
              <div className={styles.detail_last_div}>
                <span>抵扣券</span>
                <span>￥9999</span>
              </div>
            </Panel>
            <Panel header="用户实付" key="2">
              <div className={styles.detail_last_div}>
                <span>卡豆</span>
                <span>￥9999</span>
              </div>
              <div className={styles.detail_last_div}>
                <span>支付宝</span>
                <span>￥9999</span>
              </div>
            </Panel>
            <Panel header="平台服务费" key="3">
              <div className={styles.detail_last_div}>
                <span>卡豆</span>
                <span>￥9999</span>
              </div>
              <div className={styles.detail_last_div}>
                <span>现金</span>
                <span>￥9999</span>
              </div>
            </Panel>
            <Panel header="商户实收" key="4">
              <div className={styles.detail_last_div}>
                <span>卡豆</span>
                <span>￥9999</span>
              </div>
              <div className={styles.detail_last_div}>
                <span>现金</span>
                <span>￥9999</span>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </DrawerCondition>
  );
};
export default OrderDetailDraw;
