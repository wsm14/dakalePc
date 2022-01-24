import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Radio, Form, Row, Col, Select, Button, Cascader, InputNumber } from 'antd';
import {
  COUPON_BUY_RULE,
  PLATFORM_TICKET_TYPE,
  PLATFORM_USERTIME_TYPE,
  PLATFORM_INCREASE_RULE,
  CONPON_RULES_TYPE,
  PLATFORM_TICKET_SCENE,
} from '@/common/constant';
import { NUM_ALL, NUM_INT } from '@/common/regExp';
import TableDataBlock from '@/components/TableDataBlock';
import FormCondition from '@/components/FormCondition';
import RuleModal from './RuleModal';
import styles from './index.less';

const { Option } = Select;

const CouponSet = (props) => {
  const { form, type, ticket, setTicket, initialValues } = props;

  const [radioData, setRadioData] = useState({
    effectTime: 'fixed', // 券有效期
    getLimit: 'unlimited', // 领取上限
    increaseType: 0, //  是否可膨胀
  });
  const [ruleList, setRuleList] = useState([]); // 暂存所选规则
  const [visible, setVisible] = useState(false); // 选择规则的modal

  const { useTimeRule, ruleType, increaseRule, ruleList: ruleLists } = initialValues;

  useEffect(() => {
    if (initialValues.platformCouponId) {
      setRuleList(ruleLists);
      setRadioData({
        effectTime: useTimeRule, // 券有效期
        getLimit: ruleType, // 领取上限
        increaseType: increaseRule, //  是否可膨胀
      });
    }
  }, [initialValues]);

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  const getColumns = [
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      render: (val) => CONPON_RULES_TYPE[val],
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
    },
    {
      type: 'handle',
      dataIndex: 'ruleId',
      show: type === 'add',
      render: (ruleId, record) => [
        {
          type: 'del',
          auth: true,
          click: () => handleDelect(ruleId),
        },
      ],
    },
  ];

  // 删除所选规则
  const handleDelect = (ruleId) => {
    const newList = ruleList.filter((item) => item.ruleId !== ruleId);
    setRuleList(newList);
    form.setFieldsValue({
      ruleList: newList,
    });
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
              });
              saveSelectData({ areaFlag: '0' });
            }}
            className={styles.btn_Bbox}
          >
            {Object.keys(PLATFORM_TICKET_SCENE).map((item) => (
              <Radio.Button key={item} className={styles.btn_box} value={item}>
                <div>{PLATFORM_TICKET_SCENE[item]}</div>
                <div>
                  {
                    {
                      goodsBuy: '特惠商品/优惠券可用',
                      virtual: '购买虚拟商品可用',
                      commerce: '购买电商品可用',
                    }[item]
                  }
                </div>
              </Radio.Button>
            ))}
          </Radio.Group>
        </>
      ),
    },
    {
      label: '券类型',
      name: 'classType',
      type: 'radio',
      select: PLATFORM_TICKET_TYPE[ticket],
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
            if (couponValue >= thresholdPrice) {
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
      label: '是否可膨胀',
      type: 'radio',
      name: 'increaseRule',
      select: PLATFORM_INCREASE_RULE,
      onChange: (e) => saveSelectData({ increaseType: e.target.value }),
      disabled: type === 'edit',
    },
    {
      type: 'formItem',
      visible: radioData.increaseType == '1',
      className: styles.btn_all_2,
      // disabled: type === 'edit',
      formItem: (
        <div style={{ display: 'flex' }}>
          <div style={{ lineHeight: '32px' }}>可使用</div>
          <Form.Item name="beanNum" noStyle rules={[{ required: true, message: '请输入卡豆数' }]}>
            <InputNumber
              style={{ width: 110, margin: '0 5px' }}
              precision={0}
              min={1}
              addonAfter="卡豆"
              disabled={type === 'edit'}
            ></InputNumber>
          </Form.Item>
          <div style={{ lineHeight: '32px' }}>进行膨胀，最高可膨胀</div>
          <Form.Item
            name="maxValue"
            noStyle
            // rules={[{ required: true, message: '请输入膨胀金额' }]}
            rules={[
              {
                validator: (rule, value) => {
                  console.log(Number(value));
                  const maxNum = Number(form.getFieldValue('thresholdPrice')); // 使用门槛
                  const nowNum = Number(form.getFieldValue('couponValue')); // 券价值
                  if (Number(value) + nowNum > maxNum) {
                    return Promise.reject('最高膨胀金额不可高于使用门槛');
                  }
                  if (Number(value) <= 0) {
                    return Promise.reject('膨胀金额需大于0,且不能为0');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              precision={0}
              style={{ width: 110, marginLeft: 5 }}
              addonAfter="元"
              disabled={type === 'edit'}
            ></InputNumber>
          </Form.Item>
        </div>
      ),
    },
    {
      label: '其他说明',
      type: 'textArea',
      name: 'otherDesc',
      maxLength: 100,
      rules: [{ required: false }],
    },
    {
      title: '使用规则',
      type: 'noForm',
      formItem: (
        <>
          {type === 'add' && (
            <Button type="link" onClick={() => setVisible({ show: true, useScenesType: ticket })}>
              选择
            </Button>
          )}
          <TableDataBlock
            noCard={false}
            size="small"
            columns={getColumns}
            rowKey={(record) => `${record.ruleId}`}
            list={ruleList}
            total={ruleList.length}
          ></TableDataBlock>
        </>
      ),
    },
    {
      label: '规则List',
      name: 'ruleList',
      rules: [{ required: false }],
      hidden: true,
    },
  ];

  const formProps = {
    classType: 'universal',
    useScenesType: 'goodsBuy',
    useTimeRule: 'fixed',
    ruleType: 'unlimited',
    increaseRule: '0',
  };
  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={{ ...formProps, ...initialValues }}
      ></FormCondition>
      <RuleModal
        form={form}
        ruleList={ruleList}
        setRuleList={setRuleList}
        visible={visible}
        onClose={() => setVisible(false)}
      ></RuleModal>
    </>
  );
};

export default connect(({}) => ({}))(CouponSet);
