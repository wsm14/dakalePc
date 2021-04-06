import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Checkbox, Form, notification } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import CouponDetail from './Detail/PreferentialDetail';
import aliOssUpload from '@/utils/aliOssUpload';
import PreferentialSet from './Form/PreferentialSet';
import PreferentialRuleSet from './Form/PreferentialRuleSet';

const PreferentialDrawer = (props) => {
  const { visible, dispatch, childRef, loading, onClose } = props;

  // info 详情，add 新增， active 活动中修改， edit 即将开始修改
  const { type = 'info', show = false, detail = {} } = visible;

  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [formRule] = Form.useForm(); // 数据表单
  const [formRuleAdd] = Form.useForm(); // 数据表单
  const [treaty, setTreaty] = useState(false); // 是否同意协议
  const [visibleRule, setVisibleRule] = useState({ show: false, preData: {} });

  // 搜索店铺
  const fetchGetMre = () => {
    const { merchantName, ownerType } = detail;
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
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

  // 检查文件上传格式
  const checkFileData = (fileData) => {
    let aimg = [];
    switch (typeof fileData) {
      case 'undefined':
        break;
      case 'object':
        aimg = fileData.fileList.map((item) => {
          if (item.url) return item.url;
          return item.originFileObj;
        });
        break;
      default:
        aimg = [fileData];
        break;
    }
    return aimg;
  };

  // 确认提交数据 - 新增 / 修改所有数据
  const handleUpData = () => {
    (type === 'add' ? formRuleAdd : formRule).validateFields().then((values) => {
      if (!treaty) {
        notification.info({
          message: '温馨提示',
          description: '请确认《商家营销协议》',
        });
        return;
      }
      const { specialGoodsId, merchantIdStr } = detail;
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
      const aimg = checkFileData(activityGoodsImg);
      const gimg = checkFileData(goodsDescImg);
      aliOssUpload([...aimg, ...gimg]).then((res) => {
        dispatch({
          type: {
            add: 'specialGoods/fetchSpecialGoodsSave',
            edit: 'specialGoods/fetchSpecialGoodsEdit',
          }[type],
          payload: {
            ...visibleRule.preData,
            ...other,
            specialGoodsId,
            merchantIdStr,
            activityGoodsImg: res.slice(0, aimg.length).toString(),
            goodsDescImg: res.slice(aimg.length).toString(),
            activityStartTime: activityStartTime && activityStartTime[0].format('YYYY-MM-DD'),
            activityEndTime: activityStartTime && activityStartTime[1].format('YYYY-MM-DD'),
            useStartTime: useStartTime && useStartTime[0].format('YYYY-MM-DD'),
            useEndTime: useStartTime && useStartTime[1].format('YYYY-MM-DD'),
            useWeek: timeSplit !== 'part' ? timeSplit : useWeek.toString(),
            buyDesc: buyDesc.filter((i) => i),
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
    (type === 'add' ? form : formEdit).validateFields().then((values) => {
      setVisibleRule({ show: true, preData: values });
    });
  };

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
          form={form}
          initialValues={{
            ownerType: 'merchant',
            goodsType: 'single',
            packageGoodsObjects: [{}],
          }}
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
    closeCallBack: () => dispatch({ type: 'businessList/close' }), // 关闭清空搜索的商家数据
    footer: {
      add: (
        <Button onClick={handleUpAudit} type="primary">
          下一步
        </Button>
      ),
      edit: (
        <Button onClick={handleUpAudit} type="primary">
          下一步
        </Button>
      ),
      active: (
        <Button onClick={handleUpEdit} type="primary" loading={loading}>
          确定修改
        </Button>
      ),
    }[type],
  };

  // 下一步：规则弹窗属性
  const ruleModalProps = {
    title: '规则设置',
    visible: visibleRule.show,
    afterCallBack: () => fetchGetMre(),
    onClose: () => setVisibleRule(false),
    maskShow: false,
    footer: (
      <Button type="primary" onClick={handleUpData} loading={loading}>
        发布申请
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {drawerProps.children}
      <DrawerCondition {...ruleModalProps}>
        <PreferentialRuleSet form={formRuleAdd} initialValues={detail}></PreferentialRuleSet>
        <div style={{ textAlign: 'center' }}>
          <Checkbox onChange={(e) => setTreaty(e.target.checked)}>我已阅读并同意</Checkbox>
          <a>《商家营销协议》</a>
        </div>
      </DrawerCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['specialGoods/fetchSpecialGoodsSave'] ||
    loading.effects['specialGoods/fetchSpecialGoodsEdit'],
}))(PreferentialDrawer);
