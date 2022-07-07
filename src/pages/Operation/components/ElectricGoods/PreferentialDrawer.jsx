import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import PreferentialSet from './Form/PreferentialSet';

const PreferentialDrawer = (props) => {
  const { visible, dispatch, childRef, loading, onClose } = props;

  // add 新增，edit 活动中修改，again 重新发布
  const { type = 'add', show = false, detail = {} } = visible;

  const [form] = Form.useForm(); // add
  const [content, setContent] = useState(''); // 输入的富文本内容
  const [commissionShow, setCommissionShow] = useState(false); // 佣金设置显示隐藏

  // 确认提交数据 - add 新增 /  edit 修改所有数据 / again 重新发布
  const handleUpData = () => {
    form.validateFields().then(async (values) => {
      const {
        categoryNode,
        goodsBriefImg,
        customSize = [], // 规格设置的数组
        oriPrice,
        costPrice,
        settlePrice,
        sellPrice,
        sellBean,
        initStock,
        minPurchaseNum,
        batchLadderObjects,
        platformTagIds = [],
        shippingRuleObject = {},
        skuInfoReqs,
        ...other
      } = values;
      const gImg = await aliOssUpload(goodsBriefImg);

      const singleSku = [
        {
          oriPrice,
          costPrice,
          settlePrice,
          sellPrice,
          sellBean,
          initStock,
          minPurchaseNum,
          batchLadderObjects,
        },
      ];

      dispatch({
        type: {
          add: 'electricGoods/fetchSaveOnlineGoods',
          edit: 'electricGoods/fetchUpdateOnlineGoods',
          again: 'electricGoods/fetchSaveOnlineGoods',
          againUp: 'electricGoods/fetchUpdateOnlineGoods',
        }[type],
        payload: {
          goodsId: type == 'again' ? undefined : detail.goodsId,
          ...other,
          ownerId: -1,
          ownerType: 'admin',
          relateType: 'supplier',
          categoryId: categoryNode[categoryNode.length - 1],
          categoryNode: categoryNode.join('.'),
          goodsBriefImg: gImg.toString(),
          platformTagIds: platformTagIds.toString() || undefined,
          shippingRuleObject: {
            ...shippingRuleObject,
            shippingAddress:
              typeof shippingRuleObject.shippingAddress == 'string'
                ? shippingRuleObject.shippingAddress
                : shippingRuleObject.shippingAddress[shippingRuleObject.shippingAddress.length - 1],
          },
          descType: 'richText',
          richText: content, // 富文本内容
          skuInfoReqs: customSize.length > 0 ? skuInfoReqs : singleSku,
        },
        callback: () => {
          childRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const listProp = { commissionShow, setCommissionShow, editActive: type, setContent };

  // 统一处理弹窗
  const drawerProps = {
    add: {
      title: '新增活动',
      children: (
        <PreferentialSet
          {...listProp}
          form={form}
          initialValues={{
            sellType: 'single', //
            returnRuleObject: {
              returnFlag: 1,
            },
            settleInfoReq: {
              settlerType: 'admin',
              settlerId: -1,
            },
            shippingRuleObject: {
              shippingTime: '24小时内发货',
            },
            buyLimitRuleObject: {
              type: 'unlimited',
            },
            postageRuleObject: {
              type: 'free',
            },
          }}
        ></PreferentialSet>
      ),
    },
    again: {
      title: '重新发布活动',
      children: (
        <PreferentialSet {...listProp} form={form} initialValues={detail}></PreferentialSet>
      ),
    },
    againUp: {
      title: '编辑',
      children: (
        <PreferentialSet {...listProp} form={form} initialValues={detail}></PreferentialSet>
      ),
    },
    edit: {
      title: '修改活动',
      children: (
        <PreferentialSet {...listProp} form={form} initialValues={detail}></PreferentialSet>
      ),
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    destroyOnClose: true,
    bodyStyle: { paddingBottom: 10 },
    closeCallBack: () => {
      setCommissionShow(false);
    },
    footer: (
      <Button type="primary" onClick={handleUpData} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>
    </>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['electricGoods/fetchSaveOnlineGoods'] ||
    loading.effects['electricGoods/fetchUpdateOnlineGoods'],
}))(PreferentialDrawer);
