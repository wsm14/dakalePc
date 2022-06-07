import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { checkFileData } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import { getCityName } from '@/utils/utils';
import PreferentialSet from './Form/PreferentialSet';
import PreferentialRuleSet from './Form/PreferentialRuleSet';

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
        goodsDescImg,
        customSize = [], // 规格设置的数组
        oriPrice,
        costPrice,
        settlePrice,
        sellPrice,
        sellBean,
        initStock,
        minPurchaseNum,
        batchLadderObjects,
        platformTagIds,
        displayFilterTags,
        shippingRuleObject = {},
        skuInfoReqs,
        ...other
      } = values;
      const gImg = await aliOssUpload(goodsDescImg);

      // console.log('values', { ...values, customSize, content });

      // return;

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
      const payload = {
        ...other,
        ownerId: -1,
        ownerType: 'admin',
        relateType: 'supplier',
        categoryId: categoryNode[categoryNode.length - 1],
        categoryNode: categoryNode.join('.'),
        goodsDescImg: gImg.toString(),
        platformTagIds: platformTagIds.toString(),
        displayFilterTags: displayFilterTags.toString(),
        shippingRuleObject: {
          ...shippingRuleObject,
          shippingAddress: getCityName(shippingRuleObject.shippingAddress[1]),
        },
        descType: 'richText',
        richText: content, // 富文本内容
        skuInfoReqs: customSize.length > 0 ? skuInfoReqs : singleSku,
      };

      // console.log('payload: ', customSize, payload);
      // return;
      dispatch({
        type: {
          add: 'electricGoods/fetchSaveOnlineGoods',
          edit: 'electricGoods/fetchUpdateOnlineGoods',
          again: 'electricGoods/fetchSaveOnlineGoods',
          againUp: 'electricGoods/fetchUpdateOnlineGoods',
        }[type],
        type: 'electricGoods/fetchSaveOnlineGoods',
        payload: {
          ...other,
          ownerId: -1,
          ownerType: 'admin',
          relateType: 'supplier',
          categoryId: categoryNode[categoryNode.length - 1],
          categoryNode: categoryNode.join('.'),
          goodsDescImg: gImg.toString(),
          platformTagIds: platformTagIds.toString(),
          displayFilterTags: displayFilterTags.toString(),
          shippingRuleObject: {
            ...shippingRuleObject,
            shippingAddress: getCityName(shippingRuleObject.shippingAddress[1]),
          },
          richText: content, // 富文本内容
          skuInfoReqs: customSize.length > 0 ? skuInfoReqs : singleSku,
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
            settleObject: {
              settlerType: 'settle',
            },
            shippingRuleObject: {
              shippingTime: '24小时内发货',
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
    afterCallBack: () => {},
    closeCallBack: () => {
      dispatch({ type: 'baseData/clearGroupMre' }); // 关闭清空搜索的商家数据
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
  loading: loading.effects['specialGoods/fetchSpecialGoodsSave'],
}))(PreferentialDrawer);
