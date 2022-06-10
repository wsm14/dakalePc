import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { checkFileData } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import Html5Simulate from '@/components/Html5Simulate';
import aliOssUpload from '@/utils/aliOssUpload';
import PreferentialSet from './Form/PreferentialSet';
import PreferentialRuleSet from './Form/PreferentialRuleSet';

const PreferentialDrawer = (props) => {
  const { visible, dispatch, childRef, loading, onClose } = props;

  // add 新增，edit 活动中修改，again 重新发布
  const { type = 'add', show = false, detail = {}, startDisabled, infoStatus = 0 } = visible;
  const [form] = Form.useForm(); // add
  const [formEdit] = Form.useForm(); // edit
  const [formAgain] = Form.useForm(); // again 数据表单
  const [formAgainUp] = Form.useForm(); // againUp 数据表单
  const [formRuleAdd] = Form.useForm(); // 规则 数据表单
  const [content, setContent] = useState(''); // 输入的富文本内容
  const [commissionShow, setCommissionShow] = useState(false); // 佣金设置显示隐藏
  const [saveData, setSaveData] = useState(null);
  const [showHtmlData, setShowHtmlData] = useState(null);
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
    form.validateFields().then((values) => {
      const { goodsId } = detail;
      const {
        goodsBriefImg,
        goodsDescImg,
        platformTagIds = [],
        // displayFilterTags = [],
        relationOwnerIds = [],
        businessStatus,
        status,
        activityStartDate,
        useStartTime,
        timeSplit,
        timeType,
        useWeek,
        useTime,
        buyDesc = [],
        settlerType,
        settlerId,
        startDate,
        availableAreas,
        cityList = [],
        useTimeRuleObject = {},
        useDay,
        skuInfoReq, //价格对象
        paymentModeType,
        ...other
      } = values;
      const aimg = checkFileData(goodsBriefImg);
      const gimg = checkFileData(goodsDescImg);
      const cityIds = cityList.map((item) => {
        return item?.city[item?.city.length - 1];
      });
      aliOssUpload([...aimg, ...gimg]).then((res) => {
        dispatch({
          type: {
            add: 'specialGoods/fetchSpecialGoodsSave',
            edit: 'specialGoods/fetchSpecialGoodsEdit',
            again: 'specialGoods/fetchSpecialGoodsSave',
            againUp: 'specialGoods/fetchSpecialGoodsEdit',
          }[type],
          payload: {
            goodsId,
            ...other,
            richText: content, // 富文本内容
            ownerType: 'admin',
            ownerId: '-1',
            platformTagIds: platformTagIds.toString(),
            // displayFilterTags: displayFilterTags.toString(),
            relationOwnerIds: relationOwnerIds,
            goodsBriefImg: res.slice(0, aimg.length).toString(),
            goodsDescImg: res.slice(aimg.length).toString(),
            activityStartDate: activityStartDate && activityStartDate[0].format('YYYY-MM-DD'),
            activityEndDate: activityStartDate && activityStartDate[1].format('YYYY-MM-DD'),
            settleInfoReq: {
              settlerId: settlerType === 'admin' ? '-1' : settlerId,
              settlerType: settlerType,
            },
            skuInfoReq: {
              ...skuInfoReq,
              sellPrice: paymentModeType === 'free' ? 0 : skuInfoReq?.sellPrice,
            },
            paymentModeType,
            availableAreas: availableAreas === 'all' ? availableAreas : cityIds.toString(),
            useTimeRuleObject: {
              ...useTimeRuleObject,
              startDate: startDate && startDate[0].format('YYYY-MM-DD'),
              EndDate: startDate && startDate[1].format('YYYY-MM-DD'),
              useWeek: timeSplit !== 'part' ? timeSplit : useWeek.toString(),
              useDay:
                timeType !== 'part'
                  ? timeType
                  : `${useDay[0].format('HH:mm')}-${useDay[1].format('HH:mm')}`,
            },
            buyDesc: buyDesc.filter((i) => i).length ? buyDesc.filter((i) => i) : undefined,
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
  const listProp = {
    commissionShow,
    setCommissionShow,
    editActive: type,
    setContent,
    startDisabled,
    infoStatus: Boolean(Number(infoStatus)),
  };

  // 统一处理弹窗
  const drawerProps = {
    add: {
      title: '新增活动',
      children: (
        <PreferentialSet
          {...listProp}
          form={form}
          initialValues={{
            thirdType: '1',
            relateType: 'merchant',
            settlerType: 'merchant',
            availableAreas: 'all',
            productType: 'single',
            descType: 'imgText',
            packageGoodsObjects: [{}],
            needOrder: 0,
            allowRefund: 1,
            allowExpireRefund: 1,
            expireRefund: 1,
            timeSplit: '1,2,3,4,5,6,7',
            timeType: '00:00-23:59',
          }}
          onValuesChange={setShowHtmlData}
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
        <PreferentialSet
          {...listProp}
          form={form}
          initialValues={detail}
          onValuesChange={setShowHtmlData}
        ></PreferentialSet>
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
    // afterCallBack: () => fetchGetMre(),
    closeCallBack: () => {
      dispatch({ type: 'baseData/clearGroupMre' }); // 关闭清空搜索的商家数据
      setSaveData(null);
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
    loading.effects['specialGoods/fetchSpecialGoodsSave'] ||
    loading.effects['specialGoods/fetchSpecialGoodsEdit'] ||
    loading.effects['baseData/fetchGetGroupMreList'],
}))(PreferentialDrawer);
