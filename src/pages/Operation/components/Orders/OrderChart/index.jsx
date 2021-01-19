import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Card, Statistic } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';
import Searchs from './Search';

/**
 * 营收统计
 */
const OrderChart = ({ dispatch, totalData, loading }) => {
  const [searchData, setSearchData] = useState({
    beginDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    fetchGetTotalData(searchData);
  }, [searchData]);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockOrder',
      payload,
    });
  };

  const orderArr = [
    {
      title: '店铺总营收金额',
      info: '店铺通过扫码支付或核销券码实际收到的金额，包括现金收入、平台服务费、卡豆收入',
      key: 'allTotal',
      numName: false,
    },
    {
      title: '扫码付金额',
      info: '店铺通过扫码支付收到的金额，包括现金收入、平台服务费、卡豆收入',
      key: 'scan',
    },
    {
      title: '核销金额',
      info: '店铺核销券码实际收到的金额，包括现金收入、平台服务费、卡豆收入',
      key: 'verificationFee',
      numName: '核销数量',
    },
    {
      title: '客单价',
      info: '总营收金额（扫码付+核销）/付款人数',
      key: 'distinctPerson',
      numName: '付款人数',
    },
    {
      title: '哒人带货销售额',
      info: '通过哒人带货成交的订单金额',
      key: 'kolGoods',
    },
    {
      title: '周边特惠销售额',
      info: '在周边特惠板块成交的订单金额',
      key: 'specialGoods',
    },
    {
      title: '抵扣券销售额',
      info: '抵扣券销售额',
      key: 'specialGoodss',
    },
    {
      title: '退款金额',
      info: '用户发起退款申请后，店铺同意退款的金额',
      key: 'refundFee',
    },
  ];

  const gridStyle = {
    width: '25%',
    minHeight: 137,
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
    <Card
      title={<Searchs setSearchData={setSearchData}></Searchs>}
      bodyStyle={{ padding: 0, minHeight: 274 }}
      loading={loading}
      bordered={false}
      style={{ marginBottom: 20 }}
    >
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
            valueStyle={item.key === 'allTotal' ? { fontSize: 40 } : {}}
            value={checkData(totalData[item.key], 'totalFee')}
            precision={2}
          />
          {item.numName !== false && (
            <span style={allStyle}>
              {item.numName ? item.numName : '订单数'}：{checkData(totalData[item.key], 'docCount')}
            </span>
          )}
        </Card.Grid>
      ))}
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  totalData: chartBlock.orderInfo,
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(OrderChart);
