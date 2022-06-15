import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, InputNumber, Cascader } from 'antd';
import {
  MARKETACTIVITY_RULE,
  MARKETACTIVITY_BUY_RULE,
  MARKETACTIVITY_USER_RULE,
  MARKETACTIVITY_SUBSIDY_RULE,
} from '@/common/constant';
import { Radio, Select } from '@/components/FormCondition/formModule';
import FormCondition from '@/components/FormCondition';
import SubsidyCouponsTable from './SubsidyCouponsTable';

const { SHOW_CHILD } = Cascader;

const MarketActivityBaseForm = (props) => {
  const { initialValues = {}, form, dispatch, tradeList, classifyList, userType = '' } = props;

  // 活动规则
  const activityRule = Form.useWatch(['activityRuleObject', 'activityRuleType'], form) || [];
  // 折扣监听
  const disCount = Form.useWatch(['activityRuleObject', 'discount'], form) || 10;
  // 使用规则
  const userRule = Form.useWatch(['useRuleObject', 'useRuleType'], form) || [];
  // 限购规则
  const limitRule = Form.useWatch(['useRuleObject', 'limit', 'type'], form) || '';
  // 补贴规则
  const subsidyRule = Form.useWatch(['useRuleObject', 'subsidy', 'type'], form) || '';

  useEffect(() => {
    fetchTradeList();
    fetchGetGoodsClassify();
  }, []);

  // 获取行业类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 获取电商品后台类目
  const fetchGetGoodsClassify = () => {
    dispatch({ type: 'baseData/fetchParentListClassify' });
  };

  const formItems = [
    {
      label: '活动名称',
      name: 'activityName',
      maxLength: 15,
    },
    {
      label: '活动时间',
      name: 'startDate',
      type: 'rangePicker',
    },
    {
      label: '活动规则',
      name: ['activityRuleObject', 'activityRuleType'],
      type: 'checkbox',
      select: MARKETACTIVITY_RULE,
    },
    {
      label: '优惠规则',
      type: 'formItem',
      required: true,
      visible: activityRule.includes('discount'),
      formItem: (
        <div style={{ lineHeight: '31px' }}>
          报名参与本次活动的商家所提供的特惠套餐价格不可高于
          <Form.Item
            noStyle
            name={['activityRuleObject', 'discount']}
            rules={[{ required: true, message: '请输入折扣' }]}
          >
            <InputNumber
              min={0}
              max={10}
              precision={0}
              addonAfter={'折'}
              placeholder="请输入"
              style={{ width: 100, margin: '0 4px' }}
            />
          </Form.Item>
          商品结算价也根据折扣同步递减
        </div>
      ),
      extra: (
        <>
          （假设商品售价￥50，结算价为￥45，活动价不可高于
          <span style={{ color: '#ff6d6d' }}>{disCount}</span>
          折，则商品价格需≤￥{5 * disCount}，结算价相应调整为≤￥{4.5 * disCount}）
        </>
      ),
    },
    {
      label: '行业规则',
      type: 'formItem',
      required: true,
      visible: activityRule.includes('categories'),
      formItem: (
        <div style={{ lineHeight: '31px' }}>
          本次活动仅限
          <Form.Item
            noStyle
            name={['activityRuleObject', 'categories']}
            rules={[{ required: true, message: '请选择行业' }]}
          >
            <Select
              label={'行业'}
              type="multiple"
              select={tradeList}
              style={{ width: 'auto', margin: '0 4px', minWidth: '21%', maxWidth: '73%' }}
              fieldNames={{ label: 'categoryName', value: 'categoryIdString' }}
            />
          </Form.Item>
          参加
        </div>
      ),
    },
    {
      label: '类目规则',
      type: 'formItem',
      required: true,
      visible: activityRule.includes('classifies'),
      formItem: (
        <div style={{ lineHeight: '31px' }}>
          本次活动仅限
          <Form.Item
            noStyle
            name={['activityRuleObject', 'classifies']}
            rules={[{ required: true, message: '请选择类目' }]}
          >
            <Cascader
              multiple
              showCheckedStrategy={SHOW_CHILD}
              options={classifyList}
              placeholder={'请选择类目'}
              showSearch
              allowClear={false}
              displayRender={(label) => label.join('/')}
              style={{ width: 'auto', margin: '0 4px', minWidth: '21%', maxWidth: '73%' }}
              fieldNames={{ label: 'classifyName', value: 'classifyId', children: 'childList' }}
            />
          </Form.Item>
          参加
        </div>
      ),
    },
    {
      label: '活动备注',
      name: 'activityRemarks',
      type: 'textArea',
      rules: [{ required: false }],
    },
    {
      label: '使用规则',
      name: ['useRuleObject', 'useRuleType'],
      type: 'checkbox',
      select: MARKETACTIVITY_USER_RULE,
    },
    {
      label: '限购规则',
      type: 'formItem',
      required: true,
      visible: userRule.includes('limit'),
      formItem: (
        <>
          <div style={{ marginTop: limitRule === 'personLimit' && 5 }}>
            <Form.Item
              noStyle
              name={['useRuleObject', 'limit', 'type']}
              rules={[{ required: true, message: '请选择限购规则' }]}
            >
              <Radio select={MARKETACTIVITY_BUY_RULE} />
            </Form.Item>
          </div>
          {limitRule === 'personLimit' && (
            <div style={{ lineHeight: '31px', marginTop: 24 }}>
              每人限购
              <Form.Item
                noStyle
                name={['useRuleObject', 'limit', 'limitNum']}
                rules={[{ required: true, message: '请输入限购数量' }]}
              >
                <InputNumber
                  min={0}
                  max={99999999}
                  precision={0}
                  addonAfter={'份'}
                  placeholder="请输入"
                  style={{ width: 120, marginLeft: 5 }}
                />
              </Form.Item>
            </div>
          )}
        </>
      ),
    },
    {
      label: '补贴规则',
      type: 'formItem',
      required: true,
      // visible: userRule.includes('subsidy'),
      formItem: (
        <>
          <div style={{ marginTop: subsidyRule && 5 }}>
            <Form.Item
              noStyle
              name={['useRuleObject', 'subsidy', 'type']}
              rules={[{ required: true, message: '请选择补贴规则' }]}
            >
              <Radio select={MARKETACTIVITY_SUBSIDY_RULE} />
            </Form.Item>
          </div>
          {subsidyRule === 'rate' && (
            <div style={{ lineHeight: '31px', marginTop: 24 }}>
              卡豆抵扣比例
              <Form.Item
                noStyle
                name={['useRuleObject', 'subsidy', 'rate']}
                rules={[{ required: true, message: '请输入卡豆抵扣比例' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  precision={0}
                  addonAfter={'%'}
                  placeholder="请输入卡豆抵扣比例"
                  style={{ width: 200, marginLeft: 5 }}
                />
              </Form.Item>
            </div>
          )}
          {subsidyRule === 'coupon' && (
            <div style={{ lineHeight: '31px', marginTop: 24 }}>
              {/* 赠送平台券列表 */}
              <SubsidyCouponsTable form={form}></SubsidyCouponsTable>
            </div>
          )}
        </>
      ),
    },
    {
      label: '使用备注',
      name: 'useRemarks',
      type: 'textArea',
      rules: [{ required: false }],
    },
    {
      label: '活动链接',
      name: 'url',
      rules: [{ required: false }],
      addRules: [
        {
          type: 'url',
          message: '请输入正确链接格式',
        },
      ],
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </>
  );
};

export default connect(({ baseData, sysTradeList, loading }) => ({
  classifyList: baseData.classifyParentList,
  experLevel: baseData.experLevel,
  tradeList: sysTradeList.list.list,
}))(MarketActivityBaseForm);
