import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { checkFileData } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import PreferentialSet from './Form/PlatformEquitySet';
import PreferentialRuleSet from './Form/PlatformEquityRuleSet';

const PlatformEquityDrawer = (props) => {
  const { visible, dispatch, childRef, loading, onClose } = props;

  // add 新增，edit 活动中修改，again 重新发布
  const { type = 'add', show = false, detail = {} } = visible;

  const [form] = Form.useForm(); // add
  const [formEdit] = Form.useForm(); // edit
  const [formAgain] = Form.useForm(); // again 数据表单
  const [formAgainUp] = Form.useForm(); // againUp 数据表单
  const [formRuleAdd] = Form.useForm(); // 规则 数据表单
  const [content, setContent] = useState(''); // 输入的富文本内容
  const [commissionShow, setCommissionShow] = useState(false); // 佣金设置显示隐藏
  const [saveData, setSaveData] = useState(null);
  const [visibleRule, setVisibleRule] = useState({ show: false, preData: {} });

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
    formRuleAdd.validateFields().then((values) => {
      const { id } = detail;
      const {
        activityGoodsImg,
        goodsDescImg,
        goodsTags = [],
        merchantIds = [],
        ...otherPre
      } = visibleRule.preData;
      const {
        activityStartTime,
        useStartTime,
        timeSplit,
        timeType,
        useWeek,
        useTime,
        buyDesc = [],
        ...other
      } = values;
      const aimg = checkFileData(activityGoodsImg);
      const gimg = checkFileData(goodsDescImg);
      aliOssUpload([...aimg, ...gimg]).then((res) => {
        dispatch({
          type: {
            add: 'specialGoods/fetchPlatformEquityGoodsSave',
            edit: 'specialGoods/fetchPlatformEquityGoodsEdit',
            again: 'specialGoods/fetchPlatformEquityGoodsSave',
            againUp: 'specialGoods/fetchPlatformEquityGoodsEdit',
          }[type],
          payload: {
            id,
            ...otherPre,
            ...other,
            ownerType: 'admin',
            ownerId: -1,
            richText: content, // 富文本内容
            goodsTags: goodsTags.toString(),
            merchantIds: merchantIds.toString(),
            activityGoodsImg: res.slice(0, aimg.length).toString(),
            goodsDescImg: res.slice(aimg.length).toString(),
            activityStartTime: activityStartTime && activityStartTime[0].format('YYYY-MM-DD'),
            activityEndTime: activityStartTime && activityStartTime[1].format('YYYY-MM-DD'),
            useStartTime: useStartTime && useStartTime[0].format('YYYY-MM-DD'),
            useEndTime: useStartTime && useStartTime[1].format('YYYY-MM-DD'),
            useWeek: timeSplit !== 'part' ? timeSplit : useWeek.toString(),
            buyDesc: buyDesc.filter((i) => i).length ? buyDesc.filter((i) => i) : undefined,
            useTime:
              timeType !== 'part'
                ? timeType
                : `${useTime[0].format('HH:mm')}-${useTime[1].format('HH:mm')}`,
          },
          callback: () => {
            onClose();
            setVisibleRule(false);
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  // 下一步
  const handleUpAudit = () => {
    ({ add: form, again: formAgain, edit: formEdit, againUp: formAgainUp }[type]
      .validateFields()
      .then((values) => {
        setVisibleRule({ show: true, preData: values });
      }));
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
            relateType: 'merchant',
            goodsType: 'single',
            goodsDescType: '1',
            paymentModeObject: { type: 'self' },
            packageGoodsObjects: [{}],
          }}
        ></PreferentialSet>
      ),
    },
    again: {
      title: '重新发布活动',
      children: (
        <PreferentialSet {...listProp} form={formAgain} initialValues={detail}></PreferentialSet>
      ),
    },
    againUp: {
      title: '编辑',
      children: (
        <PreferentialSet {...listProp} form={formAgainUp} initialValues={detail}></PreferentialSet>
      ),
    },
    edit: {
      title: '修改活动',
      children: (
        <PreferentialSet {...listProp} form={formEdit} initialValues={detail}></PreferentialSet>
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
      setSaveData(null);
    },
    footer: (
      <Button onClick={handleUpAudit} disabled={!commissionShow} type="primary">
        下一步
      </Button>
    ),
  };

  // 下一步：规则弹窗属性
  const ruleModalProps = {
    title: '规则设置',
    visible: visibleRule.show,
    afterCallBack: () => fetchGetMre(),
    onClose: () => {
      setSaveData(formRuleAdd.getFieldsValue());
      setVisibleRule(false);
    },
    maskShow: false,
    footer: (
      <Button type="primary" onClick={handleUpData} loading={loading}>
        发布商品
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {drawerProps.children}
      <DrawerCondition {...ruleModalProps}>
        <PreferentialRuleSet
          editActive={type}
          form={formRuleAdd}
          initialValues={saveData || detail}
        ></PreferentialRuleSet>
      </DrawerCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['specialGoods/fetchPlatformEquityGoodsSave'] ||
    loading.effects['specialGoods/fetchPlatformEquityGoodsEdit'] ||
    loading.effects['baseData/fetchGetGroupMreList'],
}))(PlatformEquityDrawer);
