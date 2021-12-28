import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Radio, Form, InputNumber } from 'antd';
import {
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_BUY_RULE,
  SPECIAL_USERTIME_TYPE,
  PLATFORM_TICKET_TYPE,
  PLATFORM_USERTIME_TYPE,
} from '@/common/constant';
import { NUM_ALL, NUM_INT } from '@/common/regExp';
import { DescSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';
import styles from './index.less';

const CouponSet = (props) => {
  const {
    form,
    loading,
    selectList,
    skuMerchantList,
    dispatch,
    commissionShow,
    setCommissionShow,
    ownerCouponId,
    ownerId,
    initialValues,
    type,
    status,
    setContent,
  } = props;

  const [ticket, setTicket] = useState('horizontal'); // 券种类

  // 是否 编辑重新发布（上架，下架）都隐藏的数据
  const commonDisabled = ['edit', 'again'].includes(type) && ['1', '2'].includes(status);
  //活动中隐藏的编辑项//edit 且为上架中 独有不展示
  const editDisabled = type === 'edit' && status === '1';

  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [couponDetailType, setCouponDetailType] = useState('0'); // 商品介绍类型

  const [radioData, setRadioData] = useState({
    buyFlag: '0', // 是否售卖
    userFlag: '0', // 使用门槛
    effectTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
  });
  const {
    buyFlag,
    useTimeRule = '', //使用有效期
    buyRule = 'all', // 购买规则
    timeTypeCheck = '',
    useWeekCheck = '',
    reduceObject = {},
  } = initialValues;

  useEffect(() => {
    if (initialValues.ownerCouponIdString) {
      const userFlagCheck = !reduceObject.thresholdPrice ? '0' : '1'; // 使用门槛
      initialValues.restrictions = userFlagCheck; // 使用门槛
      initialValues.timeSplit = useWeekCheck; // 适用时段
      initialValues.timeType = timeTypeCheck; // 使用时间 小时
      // 图文介绍类型
      setCouponDetailType(initialValues.couponDetailType);
      // 适用时段
      setRadioData({
        buyFlag,
        userFlag: userFlagCheck, //详情无返回//使用门槛
        effectTime: useTimeRule ? useTimeRule : '',
        timeSplit: useWeekCheck,
        timeType: timeTypeCheck,
        buyRule,
      });

      if (initialValues.ownerName || initialValues.ownerType) {
        setMreList({
          type: initialValues.ownerType,
          groupId: initialValues.ownerId,
        });
        // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/平台标签
        fetchGetMre(initialValues.ownerName, initialValues.ownerType, (list = []) => {
          const mreFindIndex = list.findIndex((item) => item.value === initialValues.ownerId);
          const topCategoryId = list[mreFindIndex].topCategoryId[0];
          const { businessStatus, status } = list[mreFindIndex];
          // 是否分佣
          getCommissionFlag(topCategoryId);
          // 商家状态
          form.setFieldsValue({ businessStatus, status });
        });
        if (initialValues.ownerType === 'group') {
          getMerchantList();
        }
      }
    }
  }, [initialValues]);

  const saveMreData = (data) => setMreList((old) => ({ ...old, ...data }));

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 信息
  const formItems = [
    {
      title: '券类型',
      type: 'formItem',
      name: 'aaa',
      rules: [{ required: true, message: '请选择券类型' }],
      className: styles.btn_all,
      formItem: (
        <>
          <Radio.Group
            value={ticket}
            onChange={(e) => {
              setTicket(e.target.value);
            }}
            className={styles.btn_Bbox}
          >
            <Radio.Button className={styles.btn_box} value="horizontal">
              <div>商品券</div>
              <div>特惠商品/优惠券可用</div>
            </Radio.Button>
            <Radio.Button className={styles.btn_box} value="vertical">
              <div>虚拟品券</div>
              <div>购买虚拟商品可用</div>
            </Radio.Button>
            <Radio.Button className={styles.btn_box} value="inline">
              <div>电商品券</div>
              <div>购买电商品可用</div>
            </Radio.Button>
          </Radio.Group>
        </>
      ),
    },
    {
      label: '券类型',
      name: 'aaab',
      type: 'radio',
      select: PLATFORM_TICKET_TYPE,
    },
    {
      title: '基本信息',
      label: '券标题',
      name: 'aaac',
      maxLength: 15,
    },
    {
      label: '券描述',
      name: 'aaad',
      rules: [{ required: false }],
      maxLength: 30,
    },
    {
      label: '券价值',
      name: 'aaae',
      type: 'number',
      addonBefore: '￥',
      max: 999999,
      min: 0,
      precision: 2,
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
    },
    {
      label: '使用门槛',
      type: 'number',
      name: 'aaaf',
      max: 999999,
      min: 0,
      precision: 2,
      rules: [{ required: true, message: `请输入使用门槛价格` }],
      addonBefore: '满',
      addonAfter: '元可用',
    },
    {
      label: '券有效期',
      type: 'radio',
      select: PLATFORM_USERTIME_TYPE, //{ fixed: '固定时间', gain: '领取后' }
      name: 'aaag',
      onChange: (e) => saveSelectData({ effectTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'aaaga',
      type: 'rangePicker',
      visible: radioData.effectTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '领取后生效天数',
      name: 'aaagb',
      type: 'number',
      addonBefore: '领取后',
      addonAfter: '天生效',
      max: 999,
      min: 0,
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],

      visible: radioData.effectTime === 'gain',
    },
    {
      label: '有效期天数',
      name: 'aaagc',
      type: 'number',
      addonAfter: '日内有效',
      max: 999,
      min: 0,
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],

      visible: radioData.effectTime === 'gain',
    },
    {
      label: '发放总量',
      name: 'total',
      type: 'number',
      addonAfter: '张',
      extra: '修改优惠券总量时只能增加不能减少，请谨慎设置',
    },

    {
      label: '领取上限',
      type: 'radio',
      name: 'buyRule',
      select: COUPON_BUY_RULE, // { unlimited: '不限', personLimit: '每人限制', dayLimit: '每天限制' };
      onChange: (e) => saveSelectData({ buyRule: e.target.value }),
    },
    {
      label: `单人每人限制领取`,
      name: 'personLimit',
      type: 'number',
      addonBefore: '每人限制领取',
      addonAfter: '张',
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'personLimit',
    },
    {
      label: `单人每天限制领取`,
      name: 'dayMaxBuyAmount',
      type: 'number',
      addonBefore: '每人每天限制领取',
      addonAfter: '张',
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.buyRule === 'dayLimit',
    },

    {
      label: '使用地区限制',
      type: 'radio',
      select: ['无限制', '有限制'],
      name: 'restrictions',
      onChange: (e) => saveSelectData({ userFlag: e.target.value }),
    },
    {
      label: '适用人群',
      type: 'radio',
      select: COUPON_TIME_TYPE, // { '00:00-23:59': '全天', part: '固定时间' };
      name: 'timeType',
    },
    {
      label: '适用端口',
      type: 'radio',
      select: COUPON_USER_TIME, //1,2,3,4,5,6,7': '每天', part: '部分'
      name: 'timeSplit',
      onChange: (e) => saveSelectData({ timeSplit: e.target.value }),
    },
    {
      type: 'checkbox',
      select: COUPON_WEEK_TIME,
      name: 'useWeek',
      visible: radioData.timeSplit === 'part',
    },
    {
      label: '其他说明',
      type: 'textArea',
      name: 'useWeek',
      rules: [{ required: false }],
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={
          {
            reduceObject: {
              anytimeRefund: 1,
              expireRefund: 1,
            },
            ...initialValues,
          } || {
            reduceObject: {
              anytimeRefund: 1,
              expireRefund: 1,
            },
            ownerType: 'merchant',
            couponDetailType: '0',
          }
        }
      ></FormCondition>
    </>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.groupMreList,
  skuMerchantList: baseData.skuMerchantList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(CouponSet);
