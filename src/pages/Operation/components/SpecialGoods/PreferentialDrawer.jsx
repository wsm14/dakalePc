import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { checkFileData } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import Html5Simulate from '@/components/Html5Simulate';
import CouponDetail from './Detail/PreferentialDetail';
import aliOssUpload from '@/utils/aliOssUpload';
import PreferentialSet from './Form/PreferentialSet';
import PreferentialRuleSet from './Form/PreferentialRuleSet';

const PreferentialDrawer = (props) => {
  const { visible, dispatch, childRef, loading, onClose } = props;

  // info 详情，add 新增，active 活动中修改，edit 即将开始修改，again 重新发布
  const { type = 'info', show = false, detail = {}, specialGoodsId, ownerIdString } = visible;
  console.log(detail, 'detail');

  const [form] = Form.useForm(); // add
  const [formEdit] = Form.useForm(); // edit
  const [formRule] = Form.useForm(); // active 数据表单
  const [formAgain] = Form.useForm(); // again 数据表单
  const [formAgainUp] = Form.useForm(); // againUp 数据表单
  const [formRuleAdd] = Form.useForm(); // 规则 数据表单
  const [commissionShow, setCommissionShow] = useState(false); // 佣金设置显示隐藏
  const [saveData, setSaveData] = useState(null);
  const [showHtmlData, setShowHtmlData] = useState(null);
  const [visibleRule, setVisibleRule] = useState({ show: false, preData: {} });

  // 搜索店铺
  const fetchGetMre = () => {
    const { merchantName, ownerType } = detail;
    if (!merchantName) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        limit: 999,
        page: 1,
        bankStatus: 3,
        businessStatus: 1,
        merchantName,
        groupFlag: ownerType === 'merchant' ? 0 : 1,
      },
    });
  };

  // 确认提交数据 - add 新增 /  edit 修改所有数据 / again 重新发布
  const handleUpData = () => {
    formRuleAdd.validateFields().then((values) => {
      const { id, ownerId } = detail;
      const { activityGoodsImg, goodsDescImg } = visibleRule.preData;
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
      console.log(values, 'sssssss');
      const aimg = checkFileData(activityGoodsImg);
      const gimg = checkFileData(goodsDescImg);
      aliOssUpload([...aimg, ...gimg]).then((res) => {
        dispatch({
          type: {
            add: 'specialGoods/fetchSpecialGoodsSave',
            edit: 'specialGoods/fetchSpecialGoodsEdit',
            again: 'specialGoods/fetchSpecialGoodsSave',
            againUp: 'specialGoods/fetchSpecialGoodsEdit',
          }[type],
          payload: {
            id,
            ...visibleRule.preData,
            ...other,
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

  // 确认修改 - 进行中的活动
  const handleUpEdit = () => {
    formRule.validateFields().then((values) => {
      const { buyDesc = [] } = values;
      dispatch({
        type: 'specialGoods/fetchSpecialGoodsEdit',
        payload: {
          ...detail,
          ...values,
          buyDesc: buyDesc.filter((i) => i),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
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

  const listProp = { commissionShow, setCommissionShow };

  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '活动详情',
      children: <CouponDetail initialValues={detail}></CouponDetail>,
    },
    add: {
      title: '新增活动',
      children: (
        <PreferentialSet
          {...listProp}
          form={form}
          initialValues={{
            ownerType: 'merchant',
            goodsType: 'single',
            packageGoodsObjects: [{}],
          }}
          onValuesChange={setShowHtmlData}
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
      title: '重新上架',
      children: (
        <PreferentialSet
          {...listProp}
          form={formAgainUp}
          initialValues={detail}
          onValuesChange={setShowHtmlData}
        ></PreferentialSet>
      ),
    },
    edit: {
      title: '修改活动',
      children: (
        <PreferentialSet editActive={true} form={formEdit} initialValues={detail}></PreferentialSet>
      ),
    },
    active: {
      title: '修改活动',
      children: (
        <PreferentialRuleSet
          form={formRule}
          editActive={true}
          initialValues={detail}
        ></PreferentialRuleSet>
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
      dispatch({ type: 'businessList/close' });
      setSaveData(null);
    }, // 关闭清空搜索的商家数据
    footer: {
      true: (
        <Button onClick={handleUpAudit} disabled={!commissionShow} type="primary">
          下一步
        </Button>
      ),
      false: (
        <Button onClick={handleUpEdit} type="primary" loading={loading}>
          确定修改
        </Button>
      ),
    }[['add', 'again', 'edit', 'againUp'].includes(type)],
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
        发布申请
      </Button>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        {drawerProps.children}
        <DrawerCondition {...ruleModalProps}>
          <PreferentialRuleSet
            form={formRuleAdd}
            initialValues={saveData || detail}
          ></PreferentialRuleSet>
        </DrawerCondition>
      </DrawerCondition>
      {/* <Html5Simulate type="goods" show={show} data={showHtmlData}></Html5Simulate> */}
    </>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['specialGoods/fetchSpecialGoodsSave'] ||
    loading.effects['specialGoods/fetchSpecialGoodsEdit'] ||
    loading.effects['baseData/fetchGetGroupMreList'],
}))(PreferentialDrawer);
