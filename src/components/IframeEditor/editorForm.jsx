import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, Upload, Modal, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCutView from '@/components/ImgCut';
import imageCompress from '@/utils/imageCompress';

/**
 *
 * editor表单封装
 * 2020年9月16日 17:37:00
 *
 * @formItems 表单内容数组
 *
 */

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

const FormItem = Form.Item;
const { Option } = Select;

const FormCondition = ({ form, formItems = [], initialValues = {} }) => {
  const [imgcut, setImgcut] = useState({ file: {}, visible: false });
  const [totalNum, setTotalNum] = useState({}); // 字数计算
  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 标题
  const [fileLists, setFileLists] = useState(() => {
    const fileobj = {};
    formItems.map((item, i) => {
      const { name } = item;
      if (item.type === 'upload') {
        if (Object.keys(initialValues).length) {
          if (Array.isArray(name)) {
            if (!initialValues[name[0]]) {
              fileobj[name[1]] = [];
              return;
            }
            const urlfile = initialValues[name[0]][name[1]];
            fileobj[name[1]] = urlfile ? [imgold(urlfile, i)] : [];
            return;
          }
          const fileArrar = initialValues[name];
          if (fileArrar && !!fileArrar.fileList) {
            fileobj[name] = fileArrar.fileList;
            return;
          }
          fileobj[name] = !Array.isArray(fileArrar)
            ? fileArrar && fileArrar.length > 0
              ? fileArrar.indexOf(',') > -1
                ? fileArrar.split(',').map((v, i) => imgold(v, i))
                : [imgold(fileArrar, i)]
              : []
            : fileArrar.map((v, i) => imgold(v, i));
        } else {
          fileobj[Array.isArray(name) ? name[1] : name] = [];
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

  const handleCutImg = (name) => (file) => {
    const newimg = fileLists[name];
    imageCompress(file).then(({ file, base64 }) => {
      newimg[newimg.length - 1].originFileObj = file;
      newimg[newimg.length - 1].thumbUrl = base64;
      setFileLists({ ...fileLists, [name]: newimg });
    });
  };

  /**
   * 选择图片上传配置
   */
  const handleUpProps = (name, itemobj) => {
    return {
      accept: 'image/*',
      onChange: (value) => {
        const { fileList } = value;
        if (!value.file.status) {
          imageCompress(value.file).then(({ file }) => {
            fileList[fileList.length - 1].originFileObj = file;
            if (itemobj && itemobj.isCut) {
              setImgcut({
                file,
                fileRido: itemobj.ratio,
                visible: true,
                name,
              });
            }
          });
          setFileLists({ ...fileLists, [name]: fileList });
        } else {
          if (!fileList.length) form.setFieldsValue({ [name]: undefined });
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
        label = '',
        name = '',
        type = 'input',
        select = [],
        addRules,
        valuePropName,
        maxLength,
        visible = true,
        hidden = false,
      } = item;

      let { extra } = item;

      let initialValue = {};
      let rules = [{ required: item.required }];
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
            onBlur={item.onBlur}
            onChange={(e) => {
              if (item.onChange) item.onChange(e);
              setTotalNum({ ...totalNum, [item.name]: e.target.value.length });
            }}
          />
        ),
        textArea: (
          <Input.TextArea
            placeholder={placeholder}
            rows={item.rows || 5}
            disabled={item.disabled}
            maxLength={maxLength}
            onChange={(e) => setTotalNum({ ...totalNum, [item.name]: e.target.value.length })}
          />
        ),
        select: (
          <Select
            showSearch
            loading={item.loading}
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
                const name = data.name ? data.name : data;
                return (
                  <Option key={data.key || j} value={value}>
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
        switch: <Switch disabled={item.disabled} />,
        upload: (
          <Upload
            multiple={item.multiple || false}
            listType="picture-card"
            fileList={fileLists[Array.isArray(name) ? name[1] : name]}
            beforeUpload={() => false}
            onPreview={handlePreview}
            {...handleUpProps(Array.isArray(name) ? name[1] : name, item)}
          >
            {fileLists[Array.isArray(name) ? name[1] : name] &&
              fileLists[Array.isArray(name) ? name[1] : name].length < (item.maxFile || 999) &&
              uploadButton}
          </Upload>
        ),
        children: item.children,
        noForm: '',
      }[type];

      if (type === 'textArea') {
        extra = (extra || maxLength) && (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, paddingRight: 5 }}>{extra}</div>
            {dataNum}
          </div>
        );
      }

      if (type === 'noForm') {
        children.push(visible && item.children);
        return;
      }

      children.push(
        visible && (
          <FormItem
            label={label}
            name={name}
            extra={extra}
            key={`${label}${name}`}
            rules={[...rules, ...(addRules || [])]}
            valuePropName={valuePropName}
            {...initialValue}
            hidden={hidden}
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

  const handleCloseCut = (name, file = false) => {
    if (typeof file !== 'boolean') {
      const fileOld = fileLists[name];
      fileOld.pop();
    }
    setImgcut({ file: {}, visible: false });
    console.log(file);
  };

  return (
    <>
      {formItems.length ? getFields() : ''}
      <Modal
        title={previewTitle}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        zIndex={1009}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal
        destroyOnClose
        title="裁剪图片"
        width={950}
        visible={imgcut.visible}
        onCancel={() => handleCloseCut(imgcut.name)}
        footer={null}
      >
        <ImgCutView
          imgRatio={imgcut.fileRido || NaN}
          uploadedImageFile={imgcut.file}
          onSubmit={handleCutImg(imgcut.name)}
          onClose={(file) => handleCloseCut(imgcut.name, file)}
        />
      </Modal>
    </>
  );
};

export default FormCondition;
