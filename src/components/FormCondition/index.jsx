import React, { useEffect } from 'react';
import { Form, Divider } from 'antd';
import { IFormModule } from './formModule';

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
  keyValue = 'formCon',
  formItems = [],
  layout = 'horizontal',
  initialValues = {},
  formItemLayouts = {},
  children,
}) => {
  const [formN] = Form.useForm();

  const formDom = form || formN;

  // 遍历表单
  const getFields = () => {
    const childrenOwn = [];
    formItems.forEach((item, i) => {
      const { title = '', label = '', name = '', type = 'input', addRules, visible = true } = item;
      // 标题
      if (title) {
        childrenOwn.push(
          <Divider orientation="left" key={`${label}${i}`}>
            {title}
          </Divider>,
        );
      }
      // 自定义formItem 结构
      if (type === 'noForm') {
        childrenOwn.push(visible && item.childrenOwn);
        return;
      }
      // 根据类型获取不同的表单组件
      const IFormItem = IFormModule[type];
      if (!IFormItem) {
        childrenOwn.push(<div>form error</div>);
        return;
      }
      // 规则 默认必填
      const rules = item.rules || [{ required: true, message: `请确认${label}` }];
      // 默认值
      const placeholder = item.placeholder || `请输入${label}`;

      // 表单组件
      const component =
        type === 'childrenOwn' ? (
          item.childrenOwn
        ) : (
          <IFormItem
            {...item}
            form={form || formN}
            initialvalues={initialValues}
            placeholder={placeholder}
            visible="true"
          ></IFormItem>
        );

      childrenOwn.push(
        visible && (
          <FormItem
            name={name}
            key={`${label}${name}`}
            rules={[...rules, ...(addRules || [])]}
            {...item}
            visible="true"
          >
            {component}
          </FormItem>
        ),
      );
    });
    return childrenOwn;
  };

  useEffect(() => {
    formDom.setFieldsValue(initialValues);
    return componentWillUnmount;
  }, [Object.keys(initialValues).length]);

  // 组件销毁执行
  const componentWillUnmount = () => {
    formDom.resetFields();
  };

  return (
    <Form
      key={keyValue}
      form={formDom}
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
