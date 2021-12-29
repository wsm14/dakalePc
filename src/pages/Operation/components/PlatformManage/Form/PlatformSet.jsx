import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import CITYJSON from '@/common/cityJson';
import { Radio, Form, Row, Col, Select, Button } from 'antd';
import {
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_BUY_RULE,
  SPECIAL_USERTIME_TYPE,
  PLATFORM_TICKET_TYPE,
  PLATFORM_USERTIME_TYPE,
  PLATFORM_COUPON_PEOPLE,
  PLATFORM_APPLY_PORT,
  PLATFORM_APPLY_PORT_TYPE,
} from '@/common/constant';
import { NUM_ALL, NUM_INT } from '@/common/regExp';
import { DescSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';
import { getCityName } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;

const CouponSet = (props) => {
  const { form, ticket, setTicket, initialValues, citys, setCitys } = props;
  const cityList = CITYJSON.filter((item) => item.level === '2');

  const [radioData, setRadioData] = useState({
    areaFlag: '0', // 地区限制
    effectTime: 'fixed', // 券有效期
    getLimit: 'unlimited', // 领取上限
    applyPort: 'all', // 适用端口
  });
  const {
    useTimeRule = '', //使用有效期
    getLimit = 'all', // 购买规则
    timeTypeCheck = '',
    useWeekCheck = '',
    reduceObject = {},
  } = initialValues;

  useEffect(() => {
    if (initialValues.ownerCouponIdString) {
      const userFlagCheck = !reduceObject.thresholdPrice ? '0' : '1'; // 使用门槛
      initialValues.restrictions = userFlagCheck; // 使用门槛
      initialValues.timeSplit = useWeekCheck; // 适用时段

      // 适用时段
      setRadioData({
        effectTime: useTimeRule ? useTimeRule : '',
        timeSplit: useWeekCheck,
        getLimit,
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

  // 添加城市
  const addCity = () => {
    const code = form.getFieldValue('cityCode');
    if (citys.indexOf(code) > -1) {
      return;
    }
    setCitys([...citys, code]);
  };
  // 信息
  const formItems = [
    {
      title: '券类型',
      type: 'formItem',
      name: 'useScenesType',
      rules: [{ required: true, message: '请选择使用场景类型' }],
      className: styles.btn_all,
      formItem: (
        <>
          <Radio.Group
            value={ticket}
            onChange={(e) => {
              setTicket(e.target.value);
              form.setFieldsValue({
                useScenesType: e.target.value,
              });
            }}
            className={styles.btn_Bbox}
          >
            <Radio.Button className={styles.btn_box} value="goodsBuy">
              <div>商品券</div>
              <div>特惠商品/优惠券可用</div>
            </Radio.Button>
            {/* <Radio.Button className={styles.btn_box} value="scan">
              <div>扫码券</div>
              <div>特惠商品/优惠券可用</div>
            </Radio.Button> */}
            <Radio.Button className={styles.btn_box} value="virtual">
              <div>虚拟券</div>
              <div>购买虚拟商品可用</div>
            </Radio.Button>
            <Radio.Button className={styles.btn_box} value="commerce">
              <div>电商券</div>
              <div>购买电商品可用</div>
            </Radio.Button>
            {/* <Radio.Button className={styles.btn_box} value="community">
              <div>团购券</div>
              <div>特惠商品/优惠券可用</div>
            </Radio.Button> */}
          </Radio.Group>
        </>
      ),
    },
    {
      label: '券类型',
      name: 'classType',
      type: 'radio',
      select: PLATFORM_TICKET_TYPE,
    },
    {
      title: '基本信息',
      label: '券标题',
      name: 'couponName',
      maxLength: 15,
    },
    {
      label: '券描述',
      name: 'couponDesc',
      rules: [{ required: false }],
      maxLength: 30,
    },
    {
      label: '券价值',
      name: 'couponValue',
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
      name: 'thresholdPrice',
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
      name: 'useTimeRule',
      onChange: (e) => saveSelectData({ effectTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'activeDate',
      type: 'rangePicker',
      visible: radioData.effectTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '领取后生效天数',
      name: 'delayDays',
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
      name: 'activeDays',
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
      name: 'ruleType',
      select: COUPON_BUY_RULE, // { unlimited: '不限', personLimit: '每人限制', dayLimit: '每天限制' };
      onChange: (e) => saveSelectData({ getLimit: e.target.value }),
    },
    {
      label: `单人每人限制领取`,
      name: 'personLimit',
      type: 'number',
      addonBefore: '每人限制领取',
      addonAfter: '张',
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.getLimit === 'personLimit',
    },
    {
      label: `单人每天限制领取`,
      name: 'dayMaxBuyAmount',
      type: 'number',
      addonBefore: '每人每天限制领取',
      addonAfter: '张',
      precision: 0,
      addRules: [{ pattern: NUM_INT, message: '份数必须为整数，且不可为0' }],
      visible: radioData.getLimit === 'dayLimit',
    },

    {
      label: '使用地区限制',
      type: 'radio',
      select: ['全国可用', '部分地区可用', '部分地区不可用'],
      name: 'ruleCondition',
      onChange: (e) => (saveSelectData({ areaFlag: e.target.value }), setCitys([])),
    },
    {
      type: 'formItem',
      style: { paddingLeft: 150 },
      visible: radioData.areaFlag != '0',
      formItem: (
        <Row gutter={8}>
          <Col span={18}>
            <Form.Item name="cityCode" noStyle>
              <Select placeholder="请选择城市" allowClear>
                {cityList.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={addCity}>
              添加
            </Button>
          </Col>
        </Row>
      ),
    },
    {
      label: '选择城市',
      type: 'noForm',
      name: 'cityCodeName',
      visible: radioData.areaFlag != '0',
      formItem: (
        <div className={styles.city_box}>
          {citys.map((item) => {
            return <span key={item}>{`${getCityName(item)}；`}</span>;
          })}
        </div>
      ),
    },

    {
      label: '适用人群',
      type: 'radio',
      name: 'consortUser',
      select: PLATFORM_COUPON_PEOPLE,
    },
    {
      label: '适用端口',
      type: 'radio',
      select: PLATFORM_APPLY_PORT,
      name: 'consortUserOs',
      onChange: (e) => saveSelectData({ applyPort: e.target.value }),
    },
    {
      label: '平台',
      type: 'checkbox',
      select: PLATFORM_APPLY_PORT_TYPE,
      name: 'apply',
      visible: radioData.applyPort === 'noAll',
    },
    {
      label: '其他说明',
      type: 'textArea',
      name: 'otherDesc',
      rules: [{ required: false }],
    },
  ];

  const formProps = {
    classType: 'universal',
    useScenesType: 'goodsBuy',
    useTimeRule: 'fixed',
    ruleType: 'unlimited',
    ruleCondition: '0',
    consortUser: 'all',
    consortUserOs: 'all',
  };
  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={{ ...formProps, ...initialValues }}
      ></FormCondition>
    </>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.groupMreList,
  skuMerchantList: baseData.skuMerchantList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(CouponSet);
