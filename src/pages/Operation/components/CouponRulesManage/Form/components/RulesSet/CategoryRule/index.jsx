import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Cascader } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 行业
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ categoryCascaderList, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: 'sysTradeList/fetchCascaderList',
    });
  }, []);

  return (
    <FormItem label="指定行业" required>
      <Form.List
        name="categoryRule"
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
    </FormItem>
    // <FormItem
    //   key={`aaaaaaaaaaa`}
    //   label="请输入参数"
    //   name={['param', 'aaaaaaaaaa']}
    //   rules={[{ required: true, message: `请输入参数` }]}
    //   style={{ maxWidth: '100%' }}
    // >
    //   <Select placeholder={'请输入参数'}></Select>
    // </FormItem>
  );
};

export default connect(({ sysTradeList }) => ({
  categoryCascaderList: sysTradeList.categoryCascaderList,
}))(index);
