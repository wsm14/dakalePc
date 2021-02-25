import React, { useEffect } from 'react';
import { Form, Divider } from 'antd';
import { IFormModule } from './formModule';
import { delectProps } from './utils';

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
}) => {
  useEffect(() => {
    form && form.setFieldsValue(initialValues);
    return () => {
      form && form.resetFields();
    };
  }, [initialValues]);

  // 遍历表单
  const getFields = () => {
    const formItemArr = [];
    formItems.forEach((item, i) => {
      let component = '';
      const {
        title = '',
        label = '',
        name = '',
        type = 'input',
        addRules,
        visible = true,
        valuePropName = 'value',
      } = item;
      // 标题
      if (title) {
        formItemArr.push(
          <Divider orientation="left" key={`${type}${label}${i}`}>
            {title}
          </Divider>,
        );
      }
      // 自定义formItem 结构
      if (type === 'noForm') {
        formItemArr.push(visible && <div key={`${label}${i}${type}`}>{item.formItem}</div>);
        return;
      }
      // 表单组件
      if (type === 'formItem') {
        component = item.formItem;
      } else {
        // 根据类型获取不同的表单组件
        const IFormItem = IFormModule[type];
        if (!IFormItem) {
          formItemArr.push(<div key={`${label}${name}${i}`}>form error</div>);
          return;
        }
        // 默认值
        const placeholder = item.placeholder || `请输入${label}`;
        const itemProps = Object.assign({}, item);
        delete itemProps.normalize;
        component = (
          <IFormItem
            {...itemProps}
            form={form || formN}
            initialvalues={initialValues}
            placeholder={placeholder}
          ></IFormItem>
        );
      }

      // 规则 默认必填
      const rules = item.rules || [{ required: true, message: `请确认${label}` }];
      const formProps = delectProps(item);
      delete formProps.onChange;
      formItemArr.push(
        visible && (
          <FormItem
            key={`${label}${name}${type}`}
            {...formProps}
            name={name}
            valuePropName={type === 'switch' ? 'checked' : valuePropName}
            rules={[...rules, ...(addRules || [])]}
          >
            {component}
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
      initialValues={initialValues}
      {...formItemLayout}
      {...formItemLayouts}
      scrollToFirstError={true}
    >
      {formItems.length ? getFields() : ''}
      {children}
    </Form>
  );
};

export default FormComponents;
