import React, { useRef } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import debounce from 'lodash/debounce';
import {
  EXPRET_DISTRIBUTION_TYPE,
  EXPRET_DISTRIBUTION_OWN_TYPE,
  EXPRET_DISTRIBUTION_STATUS,
} from '@/common/constant';
import { OrderInfo, PayerInfo, OrderStatus, Promoter } from './components/Distribution/TableInfo';
import TableDataBlock from '@/components/TableDataBlock';
import QuestionTooltip from '@/components/QuestionTooltip';

const ExpertUserDistribution = (props) => {
  const { expertUserDistribution, selectList, loadingMre, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '推广者',
      name: 'promoter',
      placeholder: '请输入推广者手机号',
    },
    {
      label: '买家',
      name: 'payer',
      placeholder: '请输入买家手机号',
    },
    {
      label: '店铺',
      name: 'merchant',
      type: 'select',
      loading: loadingMre,
      placeholder: '请输入搜索',
      select: selectList,
      onSearch: (val) => fetchClassifyGetMre(val),
    },
    {
      label: '商品',
      name: 'goodsName',
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '付款时间',
      type: 'rangePicker',
      name: 'payTimeBegin',
      end: 'payTimeEnd',
    },
    {
      label: '结算时间',
      type: 'rangePicker',
      name: 'verificationTimeBegin',
      end: 'verificationTimeEnd',
    },
    {
      label: '订单状态',
      name: 'status',
      type: 'select',
      select: EXPRET_DISTRIBUTION_STATUS,
    },
    {
      label: '订单类型',
      name: 'orderType',
      type: 'select',
      select: EXPRET_DISTRIBUTION_TYPE,
    },
    {
      label: '是否自购单',
      name: 'subCommissionType',
      type: 'select',
      select: EXPRET_DISTRIBUTION_OWN_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '订单信息',
      dataIndex: 'orderSn',
      width: 500,
      render: (val, row) => <OrderInfo data={row}></OrderInfo>,
    },
    {
      title: '买家',
      align: 'center',
      dataIndex: 'payer',
      render: (val, row) => <PayerInfo data={row}></PayerInfo>,
    },
    {
      title: (
        <QuestionTooltip
          type="quest"
          title="订单状态"
          content={`已付款：指线上订单已付款，但还未核销
          已结算：指线上订单已核销或扫码支付订单已支付，佣金已结算
          已失效：指订单关闭，订单关闭主要有：1）买家超时未付款或取消订单；2）订单付款后发起售中退款成功
          `}
        ></QuestionTooltip>
      ),
      align: 'center',
      dataIndex: 'verificationCode',
      render: (val, row) => <OrderStatus data={row}></OrderStatus>,
    },
    {
      title: (
        <QuestionTooltip
          type="quest"
          title="推广者"
          content={`1、普通用户购买商品时点击了某哒人或豆长的分享链接，则该哒人或豆长为此单的推广者；
          2、普通用户购买商品时未点击其他人分享的链接，且其家主是哒人或豆长，则其家主（哒人或豆长）为此单的推广者。
          3、哒人或豆长自己购买商品时，可根据级别自返佣金。
          `}
        ></QuestionTooltip>
      ),
      align: 'right',
      dataIndex: 'promoterCommission',
      render: (val, row) => (
        <Promoter name={row.promoter} mobile={row.promoterMobile} price={val}></Promoter>
      ),
    },
    {
      title: (
        <QuestionTooltip
          type="quest"
          title="豆长"
          content={`推广者的上级如果是豆长，则可分佣推广者收益的10%（根据级别），称为豆长`}
        ></QuestionTooltip>
      ),
      align: 'right',
      dataIndex: 'douzhangCommission',
      render: (val, row) => (
        <Promoter name={row.douzhang} mobile={row.douzhangMobile} price={val}></Promoter>
      ),
    },
  ];

  // 搜索店铺
  const fetchClassifyGetMre = debounce((content) => {
    if (!content) return;
    dispatch({
      type: 'baseData/fetchGetMerchantsSearch',
      payload: {
        content,
      },
    });
  }, 500);

  return (
    <>
      <TableDataBlock
        keepData
        title={() => (
          <div style={{ textAlign: 'right', marginTop: -16 }}>
            推广者总佣金：
            {loading ? <Spin></Spin> : `￥${expertUserDistribution.shareBeanSum}`}
            &nbsp;&nbsp; 豆长总佣金：
            {loading ? <Spin></Spin> : `￥${expertUserDistribution.teamBeanSum}`}
          </div>
        )}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.uniqueKey}`}
        dispatchType="expertUserDistribution/fetchGetList"
        {...expertUserDistribution.list}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ expertUserDistribution, baseData, loading }) => ({
  expertUserDistribution,
  kolLevel: baseData.kolLevel,
  selectList: baseData.merchantList,
  loading: loading.models.expertUserDistribution,
  loadingMre: loading.effects['baseData/fetchGetMerchantsSearch'],
}))(ExpertUserDistribution);
