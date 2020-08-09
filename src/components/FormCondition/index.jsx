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
 * @imgFileList upload默认参数
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

// 城市搜索筛选
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
          fileobj[item.name] = {
            fileList: !Array.isArray(initialValues[item.name])
              ? initialValues[item.name].length > 0
                ? [imgold(initialValues[item.name], i)]
                : []
              : item.initialValue.map((items) => imgold(items)),
          };
        } else {
          fileobj[item.name] = { fileList: [] };
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
      let initialValue = {};
      const placeholder = item.placeholder || `请输入${item.label}`;
      let rules = item.rules || [{ required: true, message: `请输入${item.label}` }];

      // 默认input
      let component = <Input placeholder={placeholder} addonAfter={item.addonAfter || ''} />;

      // 判断类型
      // 数字
      if (item.type === 'number') {
        component = <InputNumber style={{ width: '100%' }} placeholder={placeholder} />;
      }
      // textArea 输入
      if (item.type === 'textArea') {
        component = <Input.TextArea placeholder={placeholder} />;
      }
      // 时间
      if (item.type === 'timePicker') {
        rules = item.rules || [{ required: true, message: `请选择${item.label}` }];
        component = (
          <TimePicker.RangePicker
            style={{ width: '100%' }}
            format={item.format || 'HH:mm'}
            allowClear={false}
          />
        );
      }
      // 日期
      if (item.type === 'rangePicker') {
        rules = item.rules || [{ required: true, message: `请选择${item.label}` }];
        component = (
          <RangePicker
            style={{ width: '100%' }}
            allowClear={false}
            // defaultPickerValue={[
            //   moment(moment().startOf('month')).subtract(1, 'month'),
            //   moment(moment().startOf('month')).subtract(1, 'day'),
            // ]}
            disabledDate={disabledDate}
            renderExtraFooter={() =>
              '开始时间：选择日期的 00：00：00，结束时间：选择日期的 23：59：59'
            }
          />
        );
      }
      // select选择期
      if (item.type === 'select' && item.select) {
        rules = item.rules || [{ required: true, message: `请选择${item.label}` }];
        const { select } = item;
        component = (
          <Select placeholder={item.placeholder || `请选择`}>
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
        );
      }
      // 单选
      if (item.type === 'radio' && item.select) {
        const { select } = item;
        component = (
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
        );
      }
      // 级联选择
      if (item.type === 'cascader') {
        component = (
          <Cascader
            allowClear={false}
            fieldNames={item.options}
            options={item.select}
            expandTrigger="hover"
            showSearch={{
              filter,
            }}
            placeholder="选择"
          />
        );
      }
      // 上传文件
      if (item.type === 'upload') {
        rules = item.rules || [{ required: true, message: `请选择${item.label}` }];
        initialValue = { initialValue: item.initialValue };
        component = (
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileLists[item.name].fileList}
            onPreview={handlePreview}
            onChange={({ fileList }) => setFileLists({ ...fileLists, [item.name]: fileList })}
          >
            {fileLists[item.name].fileList.length < (item.maxFile || 999) && uploadButton}
          </Upload>
        );
      }
      children.push(
        <FormItem
          label={item.label}
          name={item.name}
          extra={item.extra}
          key={`${item.label}${item.name}`}
          rules={rules}
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
      {...formItemLayout}
      scrollToFirstError
      initialValues={formValue}
      layout={layout}
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
