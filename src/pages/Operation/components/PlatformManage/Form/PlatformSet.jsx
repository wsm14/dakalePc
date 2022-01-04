import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import CITYJSON from '@/common/cityJson';
import { Radio, Form, Row, Col, Select, Button } from 'antd';
import {
  COUPON_BUY_RULE,
  PLATFORM_TICKET_TYPE,
  PLATFORM_USERTIME_TYPE,
  PLATFORM_COUPON_PEOPLE,
  PLATFORM_APPLY_PORT,
  PLATFORM_APPLY_PORT_TYPE,
} from '@/common/constant';
import { NUM_ALL, NUM_INT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import { getCityName } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;

const CouponSet = (props) => {
  const { form, type, ticket, setTicket, initialValues, citys, setCitys } = props;

  const cityList = CITYJSON.filter((item) => item.level === '2');

  const [radioData, setRadioData] = useState({
    areaFlag: '0', // 地区限制
    effectTime: 'fixed', // 券有效期
    getLimit: 'unlimited', // 领取上限
    applyPort: 'all', // 适用端口
  });
  const { ruleCondition, useTimeRule, ruleType, consortUserOs, citys: initCitys } = initialValues;

  useEffect(() => {
    if (initialValues.platformCouponId) {
      setRadioData({
        areaFlag: ruleCondition, // 地区限制
        effectTime: useTimeRule, // 券有效期
        getLimit: ruleType, // 领取上限
        applyPort: consortUserOs, // 适用端口
      });
      setCitys(initCitys);
    }
  }, [initialValues]);

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 添加城市
  const addCity = () => {
    const code = form.getFieldValue('cityCode');
    if (code == undefined) return;
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
            disabled={type === 'edit'}
            value={ticket}
            onChange={(e) => {
              setTicket(e.target.value);
              form.setFieldsValue({
                useScenesType: e.target.value,
                ruleCondition: '0',
              });
              saveSelectData({ areaFlag: '0' });
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
      disabled: type === 'edit',
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
      placeholder: '仅内部可见，最多30字',
    },
    {
      label: '券价值',
      name: 'couponValue',
      type: 'number',
      disabled: type === 'edit',
      addonBefore: '￥',
      max: 999999,
      min: 0,
      precision: 2,
      addRules: [{ pattern: NUM_ALL, message: '价格必须为数字，且大于0' }],
    },
    {
      label: '使用门槛',
      type: 'number',
      disabled: type === 'edit',
      name: 'thresholdPrice',
      max: 999999,
      min: 0,
      precision: 2,
      rules: [
        { required: true, message: `请输入使用门槛价格` },
        {
          validator: (rule, value) => {
            const thresholdPrice = Number(value);
            const couponValue = Number(form.getFieldValue('couponValue'));
            if (couponValue > thresholdPrice) {
              return Promise.reject('使用门槛须高于券价值');
            }
            return Promise.resolve();
          },
        },
      ],
      addonBefore: '满',
      addonAfter: '元可用',
    },
    {
      label: '券有效期',
      disabled: type === 'edit',
      type: 'radio',
      select: PLATFORM_USERTIME_TYPE, //{ fixed: '固定时间', gain: '领取后' }
      name: 'useTimeRule',
      onChange: (e) => saveSelectData({ effectTime: e.target.value }),
    },
    {
      label: '固定时间',
      disabled: type === 'edit',
      name: 'activeDate',
      type: 'rangePicker',
      visible: radioData.effectTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '领取后生效天数',
      name: 'delayDays',
      type: 'number',
      disabled: type === 'edit',
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
      disabled: type === 'edit',
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
      disabled: type === 'edit',
      addonAfter: '张',
      max: 999999999,
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
      disabled: type === 'edit',
      type: 'radio',
      select:
        ticket === 'virtual' || ticket === 'commerce'
          ? ['全国可用']
          : ['全国可用', '部分地区可用', '部分地区不可用'],
      name: 'ruleCondition',
      addRules: [
        {
          validator: (rule, value) => {
            if (value != '0' && citys.length == 0) {
              return Promise.reject('请选择城市');
            }
            return Promise.resolve();
          },
        },
      ],
      onChange: (e) => (saveSelectData({ areaFlag: e.target.value }), setCitys([])),
    },
    {
      type: 'formItem',
      visible: radioData.areaFlag != '0',
      formItem: (
        <div style={{ paddingLeft: 150 }}>
          <Row gutter={8}>
            <Col span={18}>
              <Form.Item name="cityCode" noStyle>
                <Select disabled={type === 'edit'} placeholder="请选择城市" allowClear>
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
              <Button disabled={type === 'edit'} type="primary" onClick={addCity}>
                添加
              </Button>
            </Col>
          </Row>
        </div>
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
      disabled: type === 'edit',
      name: 'consortUser',
      select: PLATFORM_COUPON_PEOPLE,
    },
    {
      label: '适用端口',
      type: 'radio',
      disabled: type === 'edit',
      select: PLATFORM_APPLY_PORT,
      name: 'consortUserOs',
      onChange: (e) => saveSelectData({ applyPort: e.target.value }),
    },
    {
      label: '平台',
      type: 'checkbox',
      disabled: type === 'edit',
      select: PLATFORM_APPLY_PORT_TYPE,
      name: 'apply',
      visible: radioData.applyPort === 'noAll',
    },
    {
      label: '其他说明',
      type: 'textArea',
      name: 'otherDesc',
      maxLength: 100,
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

export default connect(({}) => ({}))(CouponSet);
