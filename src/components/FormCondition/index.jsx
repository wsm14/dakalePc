import React, { useEffect } from 'react';
import { Form, Divider } from 'antd';
import { IFormModule } from './formModule';
import { delectFormProps } from './utils';

/**
 *
 * 表单封装
 * 2020年8月4日 11:41:04 Dong
 *
 * @form {*} form 表单控制实例
 * @formItems 表单内容数组
 * @layout 表单排版 参考antd Form
 * @initialValues 表单参数默认值
 *
 */

// 表单排版
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 17 },
  },
};

const FormItem = Form.Item;

const FormComponents = ({
  form,
  formItems = [],
  layout = 'horizontal',
  initialValues = {},
  formItemLayouts = {},
  children,
  ...other
}) => {
  useEffect(() => {
    form && form.setFieldsValue(initialValues);
    return () => {
      form && form.resetFields();
    };
  }, [Object.keys(initialValues).length]);

  // 遍历表单
  const getFields = () => {
    const formItemArr = [];
    formItems.forEach((item, i) => {
      const { title = '', label = '', name = '', type = 'input', addRules, visible = true } = item;
      // 标题
      if (title && visible) {
        formItemArr.push(
          <Divider orientation="left" key={`${type}${label}${i}`}>
            {title}
          </Divider>,
        );
        if (Object.keys(item).length === 1) return;
      }
      // 自定义formItem 结构
      if (type === 'noForm') {
        formItemArr.push(visible && <div key={`${label}${i}${type}`}>{item.formItem}</div>);
        return;
      }
      let IFormItem = '';
      const placeholder = item.placeholder || `请输入${label}`;
      // 规则 默认必填
      let rules = item.rules || [{ required: type !== 'switch', message: `请确认${label}` }];

      // switch 默认配置
      let switchProps = {};
      if (type === 'switch') {
        switchProps = { normalize: (val) => Number(val), valuePropName: 'checked' };
      }

      // 表单组件
      if (type === 'formItem') {
        rules = [{ required: false }];
      } else {
        // 根据类型获取不同的表单组件
        IFormItem = IFormModule[type];
        if (!IFormItem) {
          formItemArr.push(<div key={`${label}${name}${i}`}>form error</div>);
          return;
        }
      }

      const formProps = { ...delectFormProps(item) };
      formItemArr.push(
        visible && (
          <FormItem
            name={name}
            key={`${label}${name}${type}`}
            {...formProps}
            {...switchProps}
            rules={[...rules, ...(addRules || [])]}
          >
            {type === 'formItem' ? (
              item.formItem
            ) : (
              <IFormItem
                {...item}
                form={form}
                initialvalues={initialValues}
                placeholder={placeholder}
              ></IFormItem>
            )}
          </FormItem>
        ),
      );
    });
    return formItemArr;
  };

  return (
    <Form
      form={form}
      layout={layout}
      // initialValues={initialValues}
      {...formItemLayout}
      {...formItemLayouts}
      scrollToFirstError={true}
      {...other}
    >
      {formItems.length ? getFields() : ''}
      {children}
    </Form>
  );
};

export default FormComponents;
