import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Statistic } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';

const OrderChart = ({ dispatch, searchData, orderInfo }) => {
  useEffect(() => {
    fetchGetTotalData();
  }, []);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockOrder',
      payload,
    });
  };

  const orderArr = [
    {
      title: '平台总营收金额',
      info: '指店铺通过扫码支付或核销券码实际收到的金额，包括现金收入、平台服务费、卡豆收入',
      key: 'allTotal',
    },
    {
      title: '扫码付金额',
      info: '指店铺通过扫码支付收到的金额，包括现金收入、平台服务费、卡豆收入',
      key: 'scan',
    },
    {
      title: '核销金额',
      info: '指店铺核销券码实际收到的金额，包括现金收入、平台服务费、卡豆收入',
      key: 'verificationFee',
    },
    {
      title: '客单价',
      info: '总营收金额（扫码付+核销）/付款人数',
      key: 'distinctPerson',
    },
    {
      title: '哒人带货销售额',
      info: '指通过哒人带货成交的订单金额',
      key: 'kolGoods',
    },
    {
      title: '周边特惠销售额',
      info: '指在周边特惠板块成交的订单金额',
      key: 'specialGoods',
    },
    {
      title: '退款金额',
      info: '指用户发起退款申请后，店铺同意退款的金额',
      key: 'refundFee',
    },
  ];

  const gridStyle = {
    width: '25%',
    height: 137,
    textAlign: 'center',
  };

  const allStyle = {
    display: 'inline-block',
    marginTop: 4,
    color: '#8f8f8f',
  };

  const checkData = (checkData, key, reData = 0) => {
    return checkData ? checkData[key] : reData;
  };

  return (
    <div>
      {orderArr.map((item) => (
        <Card.Grid style={gridStyle} key={item.title}>
          <Statistic
            title={
              <QuestionTooltip
                title={item.title}
                content={item.info}
                type="quest"
              ></QuestionTooltip>
            }
            value={checkData(orderInfo[item.key], 'totalFee')}
            precision={2}
          />
          <span style={allStyle}>订单数：{checkData(orderInfo[item.key], 'docCount')}</span>
        </Card.Grid>
      ))}
    </div>
  );
};

export default connect(({ chartBlock, loading }) => ({
  orderInfo: chartBlock.orderInfo,
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(OrderChart);
