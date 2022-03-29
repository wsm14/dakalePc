import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Radio, Select, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { CONPON_RULES_USER_TYPE } from '@/common/constant';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 用户
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ dispatch, form }) => {
  const [sonType, setSonType] = useState('daren');

  useEffect(() => {
    form.setFieldsValue({
      remark: '已选仅限哒人',
      ruleConditions: [{ condition: 'daren' }],
      subRuleType: 'user',
    });
  }, []);

  // 选择适用人群
  const handleTagChange = (e, option) => {
    setSonType(e.target.value);
    form.setFieldsValue({
      ruleConditions: [
        {
          condition: e.target.value,
        },
      ],
    });
  };

  return (
    <>
      <FormItem label="适用人群" required>
        <Radio.Group value={sonType} onChange={handleTagChange}>
          {Object.keys(CONPON_RULES_USER_TYPE).map((item) => (
            <Radio key={item} value={item}>
              {CONPON_RULES_USER_TYPE[item]}
            </Radio>
          ))}
        </Radio.Group>
      </FormItem>
      <FormItem label="subRuleType" hidden name="subRuleType">
        <Input />
      </FormItem>
      <FormItem label="remark" hidden name="remark">
        <Input />
      </FormItem>
      <FormItem label="ruleConditions" hidden name="ruleConditions">
        <Input />
      </FormItem>
    </>
  );
};

export default connect(({}) => ({}))(index);
