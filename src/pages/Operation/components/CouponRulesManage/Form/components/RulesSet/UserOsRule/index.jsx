import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Checkbox, Select, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { PLATFORM_APPLY_PORT_TYPE } from '@/common/constant';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 端口
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ dispatch, form }) => {
  useEffect(() => {
    form.setFieldsValue({
      remark: '',
      ruleConditions: [],
      subRuleType: 'userOs',
    });
  }, []);

  // 选择适用人群
  const handleTagChange = (val) => {
    form.setFieldsValue({
      ruleConditions: val.map((item) => ({
        condition: item,
      })),
      remark: `已选${val.length}个端口`,
    });
  };

  return (
    <>
      <FormItem label="使用端口" required>
        <Checkbox.Group onChange={handleTagChange}>
          {Object.keys(PLATFORM_APPLY_PORT_TYPE).map((item) => (
            <Checkbox
              style={{
                lineHeight: '32px',
              }}
              key={item}
              value={item}
            >
              {PLATFORM_APPLY_PORT_TYPE[item]}
            </Checkbox>
          ))}
        </Checkbox.Group>
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
