import React, { useRef } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import debounce from 'lodash/debounce';
import {
  EXPRET_DISTRIBUTION_TYPE,
  EXPRET_DISTRIBUTION_OWN_TYPE,
  EXPRET_DISTRIBUTION_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import QuestionTooltip from '@/components/QuestionTooltip';
import {
  OrderInfo,
  PayerInfo,
  OrderStatusInfo,
  PromoterInfo,
} from './components/Distribution/TableInfo';

const ExpertUserDistribution = (props) => {
  const { expertUserDistribution, selectList, loadingMre, loading, loadingTotal, dispatch } = props;

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
    },
    {
      label: '买家',
      name: 'payer',
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
      width: 460,
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
      render: (val, row) => <OrderStatusInfo data={row}></OrderStatusInfo>,
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
        <PromoterInfo name={row.promoter} mobile={row.promoterMobile} price={val}></PromoterInfo>
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
        <PromoterInfo name={row.douzhang} mobile={row.douzhangMobile} price={val}></PromoterInfo>
      ),
    },
  ];

  // 搜索店铺
  const fetchClassifyGetMre = debounce((merchantName) => {
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
      payload: {
        limit: 999,
        page: 1,
        bankStatus: 3,
        businessStatus: 1,
        merchantName,
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
            {loadingTotal ? <Spin></Spin> : `￥${expertUserDistribution.shareBeanSum}`}
            &nbsp;&nbsp; 豆长总佣金：
            {loadingTotal ? <Spin></Spin> : `￥${expertUserDistribution.teamBeanSum}`}
          </div>
        )}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.verificationCode}`}
        dispatchType="expertUserDistribution/fetchGetList"
        {...expertUserDistribution.list}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ businessList, expertUserDistribution, baseData, loading }) => ({
  expertUserDistribution,
  kolLevel: baseData.kolLevel,
  selectList: businessList.selectList,
  loading: loading.models.expertUserDistribution,
  loadingMre: loading.models.businessList,
  loadingTotal: loading.models.businessList,
}))(ExpertUserDistribution);
