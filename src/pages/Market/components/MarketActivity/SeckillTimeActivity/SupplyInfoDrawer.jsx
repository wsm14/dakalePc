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
    loading,
    visible,
    ruleData,
    dispatch,
    goodsType,
    marketingSeckillId,
    onClose,
    onSumbitClose,
  } = props;

  const { show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  const handleUpData = () => {
    form.validateFields().then((value) => {
      const { specialGoods = [], commerceGoods = [] } = value;
      confirm({
        title: '提交后商品信息不可再修改，确定提交吗?',
        zIndex: 1002,
        onOk() {
          dispatch({
            type: 'seckillTimeActivity/fetchSeckillTimeActivityGoodsSave',
            payload: {
              activityType: goodsType,
              marketingSeckillId,
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
              useRuleObject: ruleData,
            },
            callback: () => {
              onSumbitClose();
            },
          });
        },
      });
    });
  };

  // 弹出窗属性
  const modalProps = {
    title: `设置秒杀价`,
    visible: show,
    width: { specialGoods: 550, commerceGoods: 800 }[goodsType],
    onClose,
    zIndex: 1090,
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
                      goodsType={goodsType}
                    />
                  ),
                  commerceGoods: (
                    // 电商品
                    <CommerceGoodsFormItem
                      form={form}
                      index={index}
                      key={field.key}
                      goodsType={goodsType}
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
  loading: loading.effects['seckillTimeActivity/fetchSeckillTimeActivityGoodsSave'],
}))(SupplyInfoDrawer);
