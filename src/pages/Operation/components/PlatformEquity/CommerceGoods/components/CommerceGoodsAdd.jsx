import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { checkFileData } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import CommerceGoodsSet from './Form/CommerceGoodsSet';
// import PreferentialRuleSet from './Form/PlatformEquityRuleSet';

const CommerceGoodsAdd = (props) => {
  const { visible, dispatch, childRef, loading, onClose } = props;

  // add 新增，edit 活动中修改，again 重新发布
  const { type = 'add', show = false, detail = {} } = visible;

  const [form] = Form.useForm(); // add
  const [content, setContent] = useState(''); // 输入的富文本内容
  const [commissionShow, setCommissionShow] = useState(false); // 佣金设置显示隐藏
  const [buyFlag, setBuyFlag] = useState('1'); // 商品购买类型

  //   const [saveData, setSaveData] = useState(null);
  //   const [visibleRule, setVisibleRule] = useState({ show: false, preData: {} });

  // 搜索店铺
  const fetchGetMre = () => {
    const { merchantName, relateType } = detail;
    if (!merchantName) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        limit: 999,
        page: 1,
        bankStatus: 3,
        businessStatus: 1,
        merchantName,
        groupFlag: relateType === 'merchant' ? 0 : 1,
      },
    });
  };

  // 确认提交数据 - add 新增 /  edit 修改所有数据 / again 重新发布
  const handleUpData = () => {
    form.validateFields().then((values) => {
      console.log('values', values);
      const { id } = detail;
      const { activityGoodsImg, ...other } = values;
      const aimg = checkFileData(activityGoodsImg);
      aliOssUpload(aimg).then((res) => {
        // console.log('res', res);
        // return;
        dispatch({
          type: {
            add: 'specialGoods/fetchPlatformEquityGoodsSave',
            edit: 'specialGoods/fetchPlatformEquityGoodsEdit',
            again: 'specialGoods/fetchPlatformEquityGoodsSave',
            againUp: 'specialGoods/fetchPlatformEquityGoodsEdit',
          }[type],
          payload: {
            id,
            ...other,
            goodsType: 'single',
            relateType: 'merchant',
            rightFlag: 0,
            ownerType: 'admin',
            ownerId: -1,
            richText: content, // 富文本
            activityGoodsImg: res.toString(),
            activityType: 'commerceGoods',
          },
          callback: () => {
            onClose();
            // setVisibleRule(false);
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const listProp = {
    commissionShow,
    setCommissionShow,
    buyFlag,
    setBuyFlag,
    editActive: type,
    setContent,
  };

  // 统一处理弹窗
  const drawerProps = {
    add: {
      title: '新增活动',
      children: (
        <CommerceGoodsSet
          {...listProp}
          form={form}
          initialValues={{
            relateType: 'merchant',
            goodsType: 'single',
            goodsDescType: '1',
            paymentModeObject: { type: 'self' },
            packageGoodsObjects: [{}],
          }}
        ></CommerceGoodsSet>
      ),
    },
    again: {
      title: '重新发布活动',
      children: (
        <CommerceGoodsSet {...listProp} form={form} initialValues={detail}></CommerceGoodsSet>
      ),
    },
    againUp: {
      title: '编辑',
      children: (
        <CommerceGoodsSet {...listProp} form={form} initialValues={detail}></CommerceGoodsSet>
      ),
    },
    edit: {
      title: '修改活动',
      children: (
        <CommerceGoodsSet {...listProp} form={form} initialValues={detail}></CommerceGoodsSet>
      ),
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    afterCallBack: () => fetchGetMre(),
    closeCallBack: () => {
      dispatch({ type: 'baseData/clearGroupMre' }); // 关闭清空搜索的商家数据
    },
    footer: (
      <Button type="primary" onClick={handleUpData} loading={loading}>
        发布商品
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['specialGoods/fetchPlatformEquityGoodsSave'] ||
    loading.effects['specialGoods/fetchPlatformEquityGoodsEdit'] ||
    loading.effects['baseData/fetchGetGroupMreList'],
}))(CommerceGoodsAdd);
