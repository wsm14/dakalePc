import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SpreeDetail from './Detail/SpreeDetail';
import SpreeSet from './Form/SpreeSet';

const CouponDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail, giftTypeList } = props;

  const { type = 'info', platformGiftId, show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  useEffect(() => {
    if (show) {
      dispatch({
        type: 'spreeManage/fetchListGiftType',
      });
    }
  }, [show]);

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      // console.log('values', values);
      // return;
      const {
        giftTypeId,
        buyFlagType,
        bean,
        buyPrice,
        buyPriceCash,
        activeDate,
        ruleType,
        personLimit,
        dayMaxBuyAmount,
        platformGiftPackRelateList,
        ...other
      } = values;

      dispatch({
        type: {
          add: 'spreeManage/fetchCreatePlatformGiftPack',
          edit: 'spreeManage/fetchUpdatePlatformGiftPack',
        }[type],
        payload: {
          platformGiftId,
          ...other,
          giftTypeId,
          giftType: giftTypeList.filter((i) => i.giftTypeId == giftTypeId)[0]?.type,
          buyFlag: buyFlagType === '0' ? '0' : '1',
          buyPrice:
            buyFlagType === '0'
              ? undefined
              : buyFlagType === '1'
              ? buyPriceCash
              : bean / 100 + buyPriceCash,
          paymentModeObject:
            buyFlagType === '2'
              ? { type: 'self', bean, cash: buyPriceCash }
              : buyFlagType === '1'
              ? { type: 'defaultMode' }
              : undefined,
          activeDate: activeDate && activeDate[0].format('YYYY-MM-DD'),
          endDate: activeDate && activeDate[1].format('YYYY-MM-DD'),
          getRuleObject: {
            ruleType,
            personLimit,
            dayMaxBuyAmount,
          },
          platformGiftPackRelateList: platformGiftPackRelateList.map((item) => ({
            relateType: item.tagType,
            relateId:
              item.tagType === 'platformCoupon'
                ? item.platformCouponId
                : item.tagType === 'rightGoods'
                ? item.specialGoodsId
                : item.ownerCouponIdString,
          })),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const listProp = {
    type,
    giftTypeList,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '礼包详情',
      children: <SpreeDetail giftTypeList={giftTypeList} detail={detail}></SpreeDetail>,
    },
    add: {
      title: '新建礼包',
      children: <SpreeSet {...listProp} form={form} initialValues={detail}></SpreeSet>,
    },
    edit: {
      title: '编辑礼包',
      children: <SpreeSet {...listProp} form={form} initialValues={detail}></SpreeSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    footer: ['add', 'edit'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        新增
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ spreeManage, loading }) => ({
  giftTypeList: spreeManage.giftTypeList,
  loading:
    loading.effects['spreeManage/fetchCreatePlatformGiftPack'] ||
    loading.effects['spreeManage/fetchUpdatePlatformGiftPack'],
  loadingDetail: loading.effects['spreeManage/fetchGetPlatformGiftPackDetail'],
}))(CouponDrawer);
