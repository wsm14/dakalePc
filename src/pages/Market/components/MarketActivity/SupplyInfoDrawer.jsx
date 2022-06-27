import React from 'react';
import { connect } from 'umi';
import { Button, Form, Modal } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SpecialGoodsFormItem from './SpecialGoodsFormItem';
import CommerceGoodsFormItem from './CommerceGoodsFormItem';

const { confirm } = Modal;

// 补充信息
const SupplyInfoDrawer = (props) => {
  const {
    tableRef,
    loading,
    visible,
    dispatch,
    goodsType,
    activeDetail,
    marketingActivityId,
    onClose,
    onCloseSelect,
  } = props;

  const { show = false, detail = {} } = visible;
  const { activityName, activityRuleObject = {} } = activeDetail;
  const { activityRuleType = '', discount = '' } = activityRuleObject;

  // 获取活动折扣 表单折扣上限为活动折扣
  const typeArr = activityRuleType.split(',');
  let discountMax = '';
  if (typeArr.includes('discount')) {
    discountMax = discount;
  } else discountMax = 10;

  const [form] = Form.useForm();

  const handleUpData = () => {
    form.validateFields().then((value) => {
      const { specialGoods = [], commerceGoods = [] } = value;
      confirm({
        title: '提交后商品信息不可再修改，确定提交吗?',
        zIndex: 1002,
        onOk() {
          dispatch({
            type: 'marketActivity/fetchMarketActivityGoodsSave',
            payload: {
              activityType: goodsType,
              marketingActivityId,
              commerceGoods: commerceGoods.map(({ goodsId, ownerId, ownerType, skuList }) => ({
                goodsId,
                ownerId,
                ownerType,
                skuList,
              })),
              specialGoods: specialGoods.map(
                ({
                  goodsId,
                  ownerId,
                  discount,
                  ownerType,
                  activityTotal,
                  activitySellBean,
                  activitySellPrice,
                  activitySettlePrice,
                }) => ({
                  goodsId,
                  ownerId,
                  discount,
                  ownerType,
                  activityTotal,
                  activitySellBean,
                  activitySellPrice,
                  activitySettlePrice,
                }),
              ),
            },
            callback: () => {
              tableRef.current.fetchGetData();
              onClose();
              onCloseSelect();
            },
          });
        },
      });
    });
  };

  // 弹出窗属性
  const modalProps = {
    title: `补充信息 - ${activityName}`,
    visible: show,
    width: { specialGoods: 550, commerceGoods: 800 }[goodsType],
    onClose,
    zIndex: 1001,
    afterCallBack: () => {
      form.setFieldsValue(detail);
    },
    footer: (
      <Button onClick={handleUpData} type="primary" loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Form form={form}>
        <Form.List name={goodsType}>
          {(fields) =>
            fields.map(
              (field, index) =>
                ({
                  specialGoods: (
                    // 特惠商品
                    <SpecialGoodsFormItem
                      form={form}
                      index={index}
                      key={field.key}
                      ruleTypeArr={typeArr}
                      goodsType={goodsType}
                      discountMax={discountMax}
                    />
                  ),
                  commerceGoods: (
                    // 电商品
                    <CommerceGoodsFormItem
                      form={form}
                      index={index}
                      key={field.key}
                      ruleTypeArr={typeArr}
                      goodsType={goodsType}
                      discountMax={discountMax}
                    />
                  ),
                }[goodsType]),
            )
          }
        </Form.List>
      </Form>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketActivity/fetchMarketActivityGoodsSave'],
}))(SupplyInfoDrawer);
