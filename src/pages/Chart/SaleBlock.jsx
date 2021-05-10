import React from 'react';
import { Row } from 'antd';
import CardItem from './components/Sale/CardItem';

const SaleBlockComponent = ({}) => {
  const itemArr = [
    {
      title: '补贴卡豆数',
      tip: '指平台总补贴的卡豆数，包括补贴商家和补贴用户的',
      keyName: 'platformSubsidy',
      api: 'saleTotal/fetchPlatformSubsidy',
    },
    {
      title: '用户获取卡豆数',
      tip: '指用户通过看视频、到店打卡、圈层收益或哒人分销收益获得的卡豆',
      keyName: 'userAcquire',
      api: 'saleTotal/fetchUserAcquire',
      keyOther: [
        { title: '卡豆数', key: 'userAcquire' },
        { title: '人数', key: 'userAcquir2e' },
      ],
    },
    {
      title: '用户消耗卡豆数',
      tip: '指用户购买商品、优惠券或扫码支付时使用的卡豆数',
      keyName: 'userConsume',
      api: 'saleTotal/fetchUserConsume',
      keyOther: [
        { title: '卡豆数', key: 'userConsume' },
        { title: '人数', key: 'user2Consume' },
      ],
    },
    {
      title: '用户卡豆抵扣订单数',
      tip: '指用户购买商品或优惠券时使用了卡豆的核销订单数或扫码支付时使用了卡豆支付的订单数',
      keyName: 'userOrderBean',
      api: 'saleTotal/fetchUserOrderBean',
      keyOther: [
        { title: '核销订单', key: 'userOrderBeanVerify' },
        { title: '扫码订单', key: 'userOrderBeanScan' },
      ],
    },
    {
      title: '商家提现卡豆数',
      tip: '指商家（不含集团）提现的卡豆数',
      keyName: 'merchantWithdrawal',
      api: 'saleTotal/fetchMerchantWithdrawal',
    },
    {
      title: '裂变数',
      tip: '指用户邀请用户的人数（即有家主的新注册用户数）',
      keyName: 'userInvite',
      api: 'saleTotal/fetchUserInvite',
    },
    {
      title: '新增哒人数',
      tip: '指新解锁的哒人数，不含升级',
      keyName: 'darenCount',
      api: 'saleTotal/fetchDarenCount',
    },
    {
      title: '哒人收益卡豆数',
      tip: '指哒人实际获得的分佣（不含待分佣）',
      keyName: 'darenIncome',
      api: 'saleTotal/fetchDarenIncome',
    },
    {
      title: '杭州上架中特惠商品数',
      tip: '指杭州的店铺当前上架中的特惠商品数',
      keyName: 'SGOnHangzou',
      api: 'saleTotal/fetchSGOnHangzou',
      timeSearch: false,
    },
    {
      title: '杭州发布特惠商品数',
      tip: '指杭州的店铺新发布的特惠商品数',
      keyName: 'SGHangzou',
      api: 'saleTotal/fetchSGHangzou',
    },
    {
      title: '湘西上架中特惠商品数',
      tip: '指湘西的店铺当前上架中的特惠商品数',
      keyName: 'SGOnXiangxi',
      api: 'saleTotal/fetchSGOnXiangxi',
      timeSearch: false,
    },
    {
      title: '湘西发布特惠商品数',
      tip: '指湘西的店铺新发布的特惠商品数',
      keyName: 'SGXiangxi',
      api: 'saleTotal/fetchSGXiangxi',
    },
    {
      title: '杭州上架中视频数',
      tip: '指杭州的店铺当前上架中的视频数',
      keyName: 'momentOnHangzou',
      api: 'saleTotal/fetchMomentOnHangzou',
      timeSearch: false,
    },
    {
      title: '杭州发布视频数',
      tip: '指杭州新发布的视频数',
      keyName: 'momentHangzou',
      api: 'saleTotal/fetchMomentHangzou',
    },
    {
      title: '湘西上架中视频数',
      tip: '指湘西的店铺当前上架中的视频数',
      keyName: 'momentOnXiangxi',
      api: 'saleTotal/fetchMomentOnXiangxi',
      timeSearch: false,
    },
    {
      title: '湘西发布视频数',
      tip: '指湘西新发布的视频数',
      keyName: 'momentXiangxi',
      api: 'saleTotal/fetchMomentXiangxi',
    },
    {
      title: '浙江注册用户数',
      tip: '指注册时IP地址是浙江的新用户',
      keyName: 'UserZJ',
      api: 'saleTotal/fetchUserHangzou',
    },
    {
      title: '湖南注册用户数',
      tip: '指注册时IP地址是湖南的新用户',
      keyName: 'UserHN',
      api: 'saleTotal/fetchUserXiangxi',
    },
  ];
  return (
    <Row gutter={[12, 12]}>
      {itemArr.map((item) => (
        <CardItem
          key={item.title}
          title={item.title}
          keyName={item.keyName}
          tip={item.tip}
          api={item.api}
          timeSearch={item.timeSearch}
          keyOther={item.keyOther}
        ></CardItem>
      ))}
    </Row>
  );
};

export default SaleBlockComponent;
