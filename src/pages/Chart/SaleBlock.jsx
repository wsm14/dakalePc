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
    },
    {
      title: '用户消耗卡豆数',
      tip: '指用户购买商品、优惠券或扫码支付时使用的卡豆数',
      keyName: 'userConsume',
      api: 'saleTotal/fetchUserConsume',
    },
    {
      title: '用户卡豆抵扣订单数',
      tip: '指用户购买商品或优惠券时使用了卡豆的核销订单数或扫码支付时使用了卡豆支付的订单数',
      keyName: 'userOrderBean',
      api: 'saleTotal/fetchUserOrderBean',
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
      title: '哒人收益',
      tip: '指哒人实际获得的分佣（不含待分佣）',
      keyName: 'darenIncome',
      api: 'saleTotal/fetchDarenIncome',
    },
    {
      title: '杭州发布视频数',
      tip: '指杭州新发布的视频数',
      keyName: 'momentHangzou',
      api: 'saleTotal/fetchMomentHangzou',
    },
    {
      title: '湘西发布视频数',
      tip: '指湘西新发布的视频数',
      keyName: 'momentXiangxi',
      api: 'saleTotal/fetchMomentXiangxi',
    },
    {
      title: '杭州注册用户数',
      tip: '指注册时IP地址是杭州的新用户',
      keyName: 'userHangzou',
      api: 'saleTotal/fetchUserHangzou',
    },
    {
      title: '湘西注册用户数',
      tip: '指注册时IP地址是湘西的新用户',
      keyName: 'userXiangxi',
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
        ></CardItem>
      ))}
    </Row>
  );
};

export default SaleBlockComponent;
