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
import imageCompress from '@/utils/imageCompress';
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
}) => {
  const [totalNum, setTotalNum] = useState({}); // 字数计算
  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 标题
  const [fileLists, setFileLists] = useState(() => {
    const fileobj = {};
    formItems.map((item, i) => {
      if (item.type === 'upload') {
        if (Object.keys(initialValues).length) {
          const fileArrar = initialValues[item.name];
          if (fileArrar && !!fileArrar.fileList) {
            fileobj[item.name] = fileArrar.fileList;
            return;
          }
          fileobj[item.name] = !Array.isArray(fileArrar)
            ? fileArrar && fileArrar.length > 0
              ? [imgold(fileArrar, i)]
              : []
            : fileArrar.map((items, i) => imgold(items, i));
        } else {
          fileobj[item.name] = [];
        }
      }
    });
    return fileobj;
  }); // 文件控制列表

  // 图片获取预览base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * 选择图片上传配置
   */
  const handleUpProps = (name) => {
    return {
      accept: 'image/*',
      onChange: (value) => {
        const { fileList } = value;
        if (!value.file.status) {
          imageCompress(value.file).then(({ file }) => {
            fileList[fileList.length - 1].originFileObj = file;
            setFileLists({ ...fileLists, [name]: fileList });
          });
        } else {
          setFileLists({ ...fileLists, [name]: fileList });
        }
      },
    };
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
      const {
        title = '',
        label = '',
        name = '',
        type = 'input',
        select = [],
        addRules,
        valuePropName,
        maxLength,
        visible = true,
      } = item;

      let { extra } = item;

      let initialValue = {};
      let rules = item.rules || [{ required: true, message: `请确认${label}` }];
      const placeholder = item.placeholder || `请输入${label}`;

      const dataNum =
        maxLength &&
        `${
          totalNum[name] || (initialValues[name] && `${initialValues[name]}`.length) || 0
        }/${maxLength}`;

      // 判断类型 默认input

      let component = {
        input: (
          <Input
            placeholder={placeholder}
            suffix={item.suffix || ''}
            maxLength={maxLength}
            addonAfter={dataNum}
            disabled={item.disabled}
            onChange={(e) => {
              if (item.onChange) item.onChange(e);
              setTotalNum({ ...totalNum, [item.name]: e.target.value.length });
            }}
          />
        ),
        number: (
          <InputNumber
            disabled={item.disabled}
            style={{ width: '100%' }}
            placeholder={placeholder}
          />
        ),
        textArea: (
          <Input.TextArea
            placeholder={placeholder}
            rows={3}
            maxLength={maxLength}
            onChange={(e) => setTotalNum({ ...totalNum, [item.name]: e.target.value.length })}
          />
        ),
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
            disabledDate={item.disabledDate}
            // renderExtraFooter={() =>
            //   '开始时间：选择日期的 00：00：00，结束时间：选择日期的 23：59：59'
            // }
          />
        ),
        select: (
          <Select
            showSearch
            disabled={item.disabled}
            defaultActiveFirstOption={false}
            filterOption={item.filterOption || false}
            onSearch={item.onSearch}
            onChange={item.onChange}
            placeholder={item.placeholder || `请选择${label}`}
            style={{ width: '100%' }}
          >
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
        tags: (
          <Select mode="tags" showSearch style={{ width: '100%' }} tokenSeparators={[',', '，']}>
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
        switch: <Switch disabled={item.disabled} />,
        upload: (
          <Upload
            listType="picture-card"
            fileList={fileLists[name]}
            beforeUpload={() => false}
            onPreview={handlePreview}
            {...handleUpProps(name)}
          >
            {fileLists[name] && fileLists[name].length < (item.maxFile || 999) && uploadButton}
          </Upload>
        ),
        children: item.children,
      }[type];

      if (type === 'textArea') {
        extra = (extra || maxLength) && (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, paddingRight: 5 }}>{extra}</div>
            {dataNum}
          </div>
        );
      }

      if (title) {
        children.push(
          <Divider orientation="left" key={`${label}${i}`}>
            {title}
          </Divider>,
        );
      }

      const req = {};
      if (item.required) req.required = item.required;
      children.push(
        visible && (
          <FormItem
            {...req}
            label={label}
            name={name}
            extra={extra}
            key={`${label}${name}`}
            rules={[...rules, ...(addRules || [])]}
            valuePropName={valuePropName}
            {...initialValue}
          >
            {component}
          </FormItem>
        ),
      );
    });
    return children;
  };

  useEffect(() => {
    return componentWillUnmount;
  }, []);

  // 组件销毁执行
  const componentWillUnmount = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout={layout}
      initialValues={initialValues}
      {...formItemLayout}
      scrollToFirstError={true}
    >
      {formItems.length ? getFields() : ''}
      <Modal
        title={previewTitle}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        zIndex={1024}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Form>
  );
};

export default FormCondition;
