import React from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Radio, Input, Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

// Banner跳转类型
export const BANNER_JUMP_TYPE = { '': '无', H5: 'H5', inside: '原生页面' };

/**
 * 跳转app h5 设置表单
 * @param {Object} detail 表单回填参数
 * @returns {Object} { linkType , url | ( path , data ) }
 */
const NativeForm = ({ form }) => {
  return (
    <>
      <FormItem key={`linkType`} label="跳转类型" name={'linkType'} style={{ maxWidth: '100%' }}>
        <Radio
          select={BANNER_JUMP_TYPE}
          onChange={(e) => form.setFieldsValue({ nativeJumpType: undefined })}
        ></Radio>
      </FormItem>
      <FormItem noStyle shouldUpdate={(pre, cur) => pre.linkType !== cur.linkType}>
        {({ getFieldValue }) => {
          if (getFieldValue('linkType') === 'H5') {
            return (
              <Form.Item key={`url`} label="链接" name={'url'} rules={[{ required: true }]}>
                <Input placeholder="输入合法链接" />
              </Form.Item>
            );
          }
          if (getFieldValue('linkType') === 'inside') {
            return (
              <Form.Item key={`path`} label="链接" name={'path'} rules={[{ required: true }]}>
                <Select placeholder="请选择跳转页面" select={[]} />
              </Form.Item>
            );
          }
        }}
      </FormItem>
      <FormItem noStyle shouldUpdate={(pre, cur) => pre.path !== cur.path}>
        {({ getFieldValue }) =>
          getFieldValue('path') === 'merchant' && (
            <Form.Item key={`data`} label="数据" name={'data'} rules={[{ required: true }]}>
              <Input
                placeholder="请选择跳转的数据"
                disabled
                addonAfter={
                  <SearchOutlined
                    onClick={() =>
                      setVisibleSearch({ visible: true, valueName: 'param', type: 'merchant' })
                    }
                  />
                }
              />
            </Form.Item>
          )
        }
      </FormItem>
    </>
  );
};

export default connect()(NativeForm);
