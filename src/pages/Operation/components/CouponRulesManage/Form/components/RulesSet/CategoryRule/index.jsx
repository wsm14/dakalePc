import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Cascader, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 行业
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ categoryCascaderList, dispatch, form }) => {
  useEffect(() => {
    form.setFieldsValue({ subRuleType: 'category' });
    dispatch({
      type: 'couponRulesManage/fetchConponListCategory',
    });
  }, []);

  return (
    <FormItem label="指定行业" required>
      <Form.List
        name="ruleConditions"
        rules={[
          {
            validator: (rule, value) => {
              const val = value.some((item) => item == undefined);
              if (val || !value.length) {
                return Promise.reject(new Error('请选择行业'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field) => (
              <div style={{ marginBottom: 24 }}>
                <FormItem noStyle key={field.key} {...field}>
                  <Cascader
                    changeOnSelect={true}
                    expandTrigger="hover"
                    options={categoryCascaderList}
                    fieldNames={{
                      label: 'categoryName',
                      value: 'categoryIdString',
                      children: 'categoryDTOList',
                    }}
                    style={{ width: '90%' }}
                  ></Cascader>
                </FormItem>
                <MinusCircleOutlined
                  style={{ marginLeft: 10 }}
                  onClick={() => remove(field.name)}
                />
              </div>
            ))}
            <FormItem>
              <Form.ErrorList errors={errors} />
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加
              </Button>
            </FormItem>
          </>
        )}
      </Form.List>
      <FormItem label="subRuleType" hidden name="subRuleType">
        <Input />
      </FormItem>
    </FormItem>
  );
};

export default connect(({ couponRulesManage }) => ({
  categoryCascaderList: couponRulesManage.categoryCascaderList,
}))(index);
