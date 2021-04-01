import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form, Checkbox, notification } from 'antd';
import {
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_BUY_RULE,
  COUPON_ACTIVE_TYPE,
  SPECIAL_USERTIME_TYPE,
} from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import { NUM_INT_MAXEIGHT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const PreferentialRuleSet = ({ visible, loading, childRef, onClose, onOver, dispatch }) => {
  const { show = false, preData } = visible;

  const [form] = Form.useForm();
  const [treaty, setTreaty] = useState(false); // 是否同意协议
  const [radioData, setRadioData] = useState({
    activeTime: '', // 活动时间
    userTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
    disabledDate: [], // 限制时间
  });

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

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

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      if (!treaty) {
        notification.info({
          message: '温馨提示',
          description: '请确认《商家营销协议》',
        });
        return;
      }
      const { activityGoodsImg, goodsDescImg } = preData;
      const {
        activityStartTime,
        useStartTime,
        timeSplit,
        timeType,
        useWeek,
        useTime,
        ...other
      } = values;
      const aimg = checkFileData(activityGoodsImg);
      const gimg = checkFileData(goodsDescImg);
      aliOssUpload([...aimg, ...gimg]).then((res) => {
        dispatch({
          type: 'specialGoods/fetchSpecialGoodsSave',
          payload: {
            ...preData,
            ...other,
            activityGoodsImg: res.slice(0, aimg.length).toString(),
            goodsDescImg: res.slice(aimg.length).toString(),
            activityStartTime: activityStartTime && activityStartTime[0].format('YYYY-MM-DD'),
            activityEndTime: activityStartTime && activityStartTime[1].format('YYYY-MM-DD'),
            useStartTime: useStartTime && useStartTime[0].format('YYYY-MM-DD'),
            useEndTime: useStartTime && useStartTime[1].format('YYYY-MM-DD'),
            useWeek: timeSplit !== 'part' ? timeSplit : useWeek.toString(),
            useTime:
              timeType !== 'part'
                ? timeType
                : `${useTime[0].format('HH:mm')}-${useTime[1].format('HH:mm')}`,
          },
          callback: () => {
            onClose();
            onOver();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  // 信息
  const formItems = [
    {
      title: '设置投放规则',
      label: '活动时间',
      type: 'radio',
      select: COUPON_ACTIVE_TYPE,
      name: 'activityTimeRule',
      onChange: (e) => saveSelectData({ activeTime: e.target.value }),
    },
    {
      label: '设置时间',
      name: 'activityStartTime',
      type: 'rangePicker',
      visible: radioData.activeTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      onChange: (val) => form.setFieldsValue({ activeDate: undefined }),
    },
    {
      label: '使用有效期',
      type: 'radio',
      select: SPECIAL_USERTIME_TYPE,
      name: 'useTimeRule',
      onChange: (e) => saveSelectData({ userTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'useStartTime',
      type: 'rangePicker',
      visible: radioData.userTime === 'fixed',
      disabledDate: (time) => {
        const dates = form.getFieldValue('actsdiveDate');
        const noewdate = moment().endOf('day').subtract(1, 'day');
        if (!dates || dates.length === 0) return time < noewdate;
        const tooLate = dates[0] && time < dates[0];
        return tooLate;
      },
      onCalendarChange: (val) => saveSelectData({ disabledDate: val }),
      addRules: [
        {
          validator: (rule, time) => {
            const dates = form.getFieldValue('actsdiveDate');
            if (dates && time && time[1] < dates[1]) {
              return Promise.reject('有效期结束时间必须大于活动时间');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '领取后生效天数',
      name: 'delayDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.userTime === 'gain',
    },
    {
      label: '有效期天数',
      name: 'activeDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.userTime === 'gain',
    },
    {
      label: '适用时段',
      type: 'radio',
      select: COUPON_USER_TIME,
      name: 'timeSplit',
      onChange: (e) => saveSelectData({ timeSplit: e.target.value }),
    },
    {
      label: '每周',
      type: 'checkbox',
      select: COUPON_WEEK_TIME,
      name: 'useWeek',
      visible: radioData.timeSplit === 'part',
    },
    {
      label: '时间选择',
      type: 'radio',
      select: COUPON_TIME_TYPE,
      name: 'timeType',
      visible: radioData.timeSplit !== '',
      onChange: (e) => saveSelectData({ timeType: e.target.value }),
    },
    {
      label: '设置时间段',
      name: 'useTime',
      type: 'timePicker',
      order: false,
      visible: radioData.timeType === 'part',
    },
    {
      label: '投放总量',
      name: 'total',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '投放总量必须为整数，且不可为0' }],
      suffix: '份',
    },
    {
      title: '设置购买规则',
      label: '购买上限',
      type: 'radio',
      name: 'buyRule',
      select: COUPON_BUY_RULE,
      onChange: (e) => saveSelectData({ buyRule: e.target.value }),
    },
    {
      label: `单人每人购买份数`,
      name: 'personLimit',
      suffix: '份',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'personLimit',
    },
    {
      label: `单人每天购买份数`,
      name: 'dayMaxBuyAmount',
      suffix: '份',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'dayLimit',
    },
    {
      label: '是否需要预约购买',
      type: 'switch',
      name: 'needOrder',
      normalize: (val) => Number(val),
      rules: [{ required: false }],
    },
    {
      label: '购买须知',
      type: 'textArea',
      name: 'buyDesc',
      maxLength: 200,
    },
    {
      title: '设置退款规则',
      label: '是否允许随时退款',
      type: 'switch',
      name: 'allowRefund',
      normalize: (val) => Number(val),
      rules: [{ required: false }],
    },
    {
      label: '是否允许过期退款',
      type: 'switch',
      name: 'allowExpireRefund',
      normalize: (val) => Number(val),
      rules: [{ required: false }],
    },
  ];

  // 弹窗属性
  const modalProps = {
    title: '规则设置',
    visible: show,
    onClose,
    maskShow: false,
    footer: (
      <Button type="primary" onClick={handleUpAudit} loading={loading}>
        发布申请
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={{ ownerType: 'merchant', goodsType: 'single', groupGoods: [{}] }}
      ></FormCondition>
      <div style={{ textAlign: 'center' }}>
        <Checkbox onChange={(e) => setTreaty(e.target.checked)}>我已阅读并同意</Checkbox>
        <a>《商家营销协议》</a>
      </div>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsSave'],
}))(PreferentialRuleSet);
