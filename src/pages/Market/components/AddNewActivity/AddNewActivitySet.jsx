import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Tabs } from 'antd';
import CITYJSON from '@/common/cityJson';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import ShareCoupon from './components/ShareCoupon';

const AddNewActivitySet = (props) => {
  const { dispatch, childRef, visible, onClose } = props;
  const { show = false, detail = { specialGoods: [], rightGoods: [], prizeType: 'bean' } } =
    visible;

  const [couponData, setCouponData] = useState({ free: {}, discounts: [], equities: [] }); // 奖品权益商品的信息
  const { free, discounts, equities } = couponData;
  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  const [form] = Form.useForm();

  const { TabPane } = Tabs;
  const [tabKey, setTabKey] = useState('1'); // tab
  const [prizeTypes, setPrizeTypes] = useState('bean'); // 奖品类型

  // 新增活动
  const fetchMarketActivityAdd = () => {
    form.validateFields().then((values) => {
      const { specialGoods, rightGoods } = values;
      console.log('values', values);
      // const payload = {
      //   ...values,
      //   specialGoodsIds: specialGoods.map((item) => item.specialGoodsId).toString(),
      //   rightGoodsIds: rightGoods.map((item) => item.specialGoodsId).toString()
      // }
      //   const {
      //     activityBeginTime: time,
      //     activityBanner: { fileList },
      //   } = values;
      //   const payload = {
      //     ...values,
      //     activityBeginTime: time[0].format('YYYY-MM-DD 00:00:00'),
      //     activityEndTime: time[1].format('YYYY-MM-DD 00:00:00'),
      //   };
      //   aliOssUpload(fileList.map((item) => item.originFileObj)).then((res) => {
      //     dispatch({
      //       type: 'marketCardActivity/fetchMarketActivityAdd',
      //       payload: { ...payload, activityBanner: res.toString() },
      //       callback: () => {
      //         onClose();
      //         childRef.current.fetchGetData();
      //       },
      //     });
      //   });
    });
  };

  // 切换tab标签页
  function callback(key) {
    setTabKey(key);
  }

  const formItems = [
    {
      label: '活动城市',
      name: 'cityCode',
      type: 'select',
      select: CITYJSON.filter((item) => item.level === '2'),
      // fieldNames: { label: 'name', value: 'id' },
      // onChange: (val, group) =>
      //   // console.log(group, 'group'),
      //   setCityArr(
      //     group.map(({ option }) => ({
      //       cityCode: option.id,
      //       cityName: option.name,
      //     })),
      //   ),
    },
    {
      label: '活动名称',
      name: 'name',
      maxLength: 15,
    },
    {
      label: '邀请条件',
      type: 'number',
      name: 'inviteNum',
      suffix: '位用户即可获奖',
      formatter: (value) => `邀请 ${value}`,
      parser: (value) => value.replace('邀请', ''),
    },
    // {
    //   label: '活动时间',
    //   type: 'rangePicker',
    //   name: 'activityBeginTime',
    //   disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    // },
    {
      label: '活动规则',
      name: 'activityRuleUrl',
      placeholder: '请输入链接',
      addRules: [
        {
          type: 'url',
          message: '请输入正确链接格式',
        },
      ],
    },
    {
      title: '图片配置',
      label: '活动主页图',
      type: 'upload',
      name: 'mainImg',
      imgRatio: 750 / 600,
      extra: '请上传750*600px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '分享海报图',
      type: 'upload',
      name: 'shareImg',
      imgRatio: 750 / 1334,
      extra: '请上传750*1334px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '小程序分享图',
      type: 'upload',
      name: 'friendShareImg',
      imgRatio: 5 / 4,
      maxSize: 128,
      extra: '请上传比例为5*4，大小128kb以内的jpg图片（375*300以上）',
      maxFile: 1,
    },
    {
      label: '奖品图',
      type: 'upload',
      name: 'prizeImg',
      imgRatio: 600 / 240,
      extra: '请上传600*240px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '活动介绍图',
      type: 'upload',
      name: 'introductionImg',
      imgRatio: 686 / 800,
      extra: '请上传686*800px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '领奖成功跳转路径',
      type: 'select',
      name: 'successfulJumpUrl',
      select: {
        blindIndex: '卡豆盲盒',
        new: '新手福利页',
      },
    },
    {
      label: '奖品类型',
      name: 'prizeType',
      type: 'radio',
      select: { bean: '卡豆', equity: '权益商品' },
      onChange: (e) => {
        console.log('e', e);
        setPrizeTypes(e.target.value);
      },
    },
    {
      label: '卡豆',
      name: 'prizeBean',
      placeholder: '请输入奖励卡豆数',
      visible: prizeTypes === 'bean',
    },
    {
      label: '发放数量',
      name: 'issuedQuantity',
      visible: prizeTypes === 'bean',
    },
    {
      label: `活动信息`,
      name: 'configFissionTemplateId',
      hidden: true,
    },
    {
      label: '权益商品',
      name: 'prizeRightGoodsIds',
      type: 'formItem',
      visible: prizeTypes === 'equity',
      formItem: (
        <>
          <ShareCoupon
            type="goodsRight"
            data={free}
            form={form}
            onDel={() => saveCouponStorage({ free: {} })}
            onOk={(free) => saveCouponStorage({ free })}
          ></ShareCoupon>
        </>
      ),
    },
  ];

  const formItemsRecommend = [
    {
      title: '标题图片配置',
      label: '特惠商品标题图片',
      name: 'specialGoodsTitleImg',
      type: 'upload',
      maxFile: 1,
      imgRatio: 368 / 110,
    },
    {
      label: '权益商品标题图片',
      name: 'rightGoodsTitleImg',
      type: 'upload',
      maxFile: 1,
      imgRatio: 368 / 110,
    },
    {
      label: '选择特惠商品',
      name: 'specialGoodsIds',
      type: 'formItem',
      formItem: (
        <>
          <ShareCoupon
            type="specialGoods"
            // data={discounts}
            form={form}
            // onDel={() => saveCouponStorage({ discounts: [] })}
            // onOk={(data) => saveCouponStorage({ discounts: [...discounts, data] })}
          ></ShareCoupon>
        </>
      ),
    },
    {
      label: '选择权益商品',
      name: 'rightGoodsIds',
      type: 'formItem',
      formItem: (
        <>
          <ShareCoupon
            type="rightGoods"
            // data={equities}
            form={form}
            // onDel={() => saveCouponStorage({ equities: [] })}
            // onOk={(data) => saveCouponStorage({ equities: [...equities, data] })}
          ></ShareCoupon>
        </>
      ),
    },
  ];

  const modalProps = {
    title: `新增活动`,
    visible: show,
    onClose,
    width: 800,
    afterCallBack: () => {
      form.resetFields();
      setPrizeTypes('bean');
      setTabKey('1');
    },
    footer: (
      <Button type="primary" onClick={() => fetchMarketActivityAdd()}>
        确定
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <Tabs activeKey={tabKey} onChange={callback}>
        <TabPane tab="活动配置" key="1">
          <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
        </TabPane>
        <TabPane tab="推荐商品" key="2">
          <FormCondition
            form={form}
            formItems={formItemsRecommend}
            initialValues={detail}
          ></FormCondition>
        </TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  // marketCardActivity,
  // loading,
}))(AddNewActivitySet);
