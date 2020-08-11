import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  InputNumber,
  TimePicker,
  Upload,
  Modal,
  Cascader,
  Switch,
  Divider,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

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
    sm: { span: 16 },
  },
};

// 图片默认值
const imgold = (url, uid) => ({
  uid: `-${uid}`,
  name: 'image.png',
  status: 'done',
  url,
});

// 上传文件按钮
const uploadButton = (
  <div>
    <PlusOutlined />
    <div className="ant-upload-text">选择</div>
  </div>
);

// Cascader搜索筛选
const filter = (inputValue, path) => {
  return path.some((option) => option.name.indexOf(inputValue) > -1);
};

// 限制选择时间
const disabledDate = (current) => current && current < moment().endOf('day').subtract(7, 'day');

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const FormCondition = ({
  form = Form.useForm(),
  formItems = [],
  layout = 'horizontal',
  initialValues = {},
  resetValue,
}) => {
  const [formValue] = useState(initialValues);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileLists, setFileLists] = useState(() => {
    const fileobj = {};
    formItems.map((item, i) => {
      if (item.type === 'upload') {
        if (Object.keys(initialValues).length) {
          fileobj[item.name] = !Array.isArray(initialValues[item.name])
            ? initialValues[item.name] && initialValues[item.name].length > 0
              ? [imgold(initialValues[item.name], i)]
              : []
            : initialValues[item.name].map((items, i) => imgold(items, i));
        } else {
          fileobj[item.name] = [];
        }
      }
    });
    return fileobj;
  });

  // 图片获取预览base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // 预览图片
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setPreviewVisible(true);
  };

  // 遍历表单
  const getFields = () => {
    const children = [];

    formItems.forEach((item, i) => {
      const { select = [], name = '', type = 'input', label = '' } = item;

      let initialValue = {};
      let rules = item.rules || [{ required: true, message: `请确认${label}` }];
      const placeholder = item.placeholder || `请输入${label}`;

      // 判断类型 默认input

      let component = {
        input: <Input placeholder={placeholder} addonAfter={item.addonAfter || ''} />,
        number: <InputNumber style={{ width: '100%' }} placeholder={placeholder} />,
        textArea: <Input.TextArea placeholder={placeholder} rows={4} />,
        timePicker: (
          <TimePicker.RangePicker
            style={{ width: '100%' }}
            format={item.format || 'HH:mm'}
            allowClear={false}
          />
        ),
        rangePicker: (
          <RangePicker
            style={{ width: '100%' }}
            allowClear={false}
            // defaultPickerValue={[
            //   moment(moment().startOf('month')).subtract(1, 'month'),
            //   moment(moment().startOf('month')).subtract(1, 'day'),
            // ]}
            // disabledDate={disabledDate}
            // renderExtraFooter={() =>
            //   '开始时间：选择日期的 00：00：00，结束时间：选择日期的 23：59：59'
            // }
          />
        ),
        select: (
          <Select placeholder={item.placeholder || `请选择${label}`}>
            {select.map((data, j) => {
              if (data) {
                // 兼容数组
                const value = !data.value ? `${j}` : data.value;
                const name = data.value ? data.name : data;
                return (
                  <Option key={j} value={value}>
                    {name}
                  </Option>
                );
              }
            })}
          </Select>
        ),
        radio: (
          <Radio.Group onChange={item.onChange} disabled={item.disabled}>
            {select.map((data, j) => {
              if (data) {
                // 兼容数组
                const value = !data.value ? `${j}` : `${data.value}`;
                const name = data.name ? data.name : data;
                return (
                  <Radio key={j} value={value}>
                    {name}
                  </Radio>
                );
              }
            })}
          </Radio.Group>
        ),
        cascader: (
          <Cascader
            allowClear={false}
            fieldNames={item.options}
            options={select}
            expandTrigger="hover"
            showSearch={{
              filter,
            }}
            placeholder={item.placeholder || `请选择${label}`}
          />
        ),
        switch: <Switch />,
        upload: (
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileLists[name]}
            onPreview={handlePreview}
            onChange={({ fileList }) => {
              setFileLists({ ...fileLists, [name]: fileList });
            }}
          >
            {fileLists[name] &&
              fileLists[name].length < (item.maxFile || 999) &&
              uploadButton}
          </Upload>
        ),
      }[type];

      if (item.title) {
        children.push(
          <Divider orientation="left" key={`${label}${i}`}>
            {item.title}
          </Divider>,
        );
      }

      children.push(
        <FormItem
          label={label}
          name={name}
          extra={item.extra}
          key={`${label}${name}`}
          rules={[...rules, ...(item.addRules || [])]}
          valuePropName={item.valuePropName}
          {...initialValue}
        >
          {component}
        </FormItem>,
      );
    });
    return children;
  };

  const handleReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    handleReset();
  }, [resetValue]);

  return (
    <Form
      form={form}
      layout={layout}
      initialValues={formValue}
      {...formItemLayout}
      preserve={false}
      scrollToFirstError
    >
      {formItems.length ? getFields() : ''}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Form>
  );
};

export default FormCondition;
