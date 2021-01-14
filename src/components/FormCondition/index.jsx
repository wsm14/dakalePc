import React, { useState, useEffect, useRef } from 'react';
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
  Checkbox,
  Spin,
  Empty,
  message,
} from 'antd';
import ImgCutView from '@/components/ImgCut';
import { PlusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import imageCompress from '@/utils/imageCompress';
import CITYJSON from '@/common/city';
import moment from 'moment';
import './index.less';

const RNDContext = createDndContext(HTML5Backend);

const type = 'DragableUploadList';

const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
  const ref = React.useRef();
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move' }}
    >
      {originNode}
    </div>
  );
};

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

// 图片默认值
const imgold = (url, uid) => ({
  uid: `-${uid}`,
  name: url,
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
const filter = (inputValue, path, label = 'label') => {
  return path.some((option) => option[label].indexOf(inputValue) > -1);
};

// 限制选择时间
const disabledDate = (current) => current && current < moment().endOf('day').subtract(7, 'day');

const FormItem = Form.Item;
const { Option } = Select;

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
  const [totalNum, setTotalNum] = useState({}); // 字数计算
  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 标题
  const [fileLists, setFileLists] = useState(() => {
    const fileobj = {};
    formItems.map((item, i) => {
      const { name } = item;
      if (item.type === 'upload' || item.type === 'videoUpload') {
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

  // 上传文件限制
  const beforeUpload = (file, maxSize) => {
    if (!maxSize) return false;
    const isLt1M = file.size / 1024 / 1024 < maxSize;
    if (!isLt1M) {
      message.error(`上传图片过大，请小于${maxSize}MB！`);
      // 图片过大 不允许上传 dklFileStatus 返回out
      // 默认可上传 dklFileStatus 不存在
      file.dklFileStatus = 'out';
    }
    return false;
  };

  /**
   * 选择图片上传配置
   * onPreview={(file) => handlePreview(file, name, item.onChange)}
   */
  const handleUpProps = (name, onChange, maxFile, maxSize, isCut, imgRatio) => {
    return {
      accept: 'image/*',
      onChange: (value) => {
        const { fileList } = value;
        const newFileList = !maxSize
          ? fileList
          : // dklFileStatus  === out 的值 不允许上传
            fileList.filter((file) => file.dklFileStatus !== 'out');
        if ((!value.file.status || value.file.status === 'done') && newFileList.length) {
          const fileName = value.file.name;
          imageCompress(value.file.originFileObj || value.file).then(({ file, blob }) => {
            // 是否传入是裁剪
            if (isCut) {
              blob.uid = value.file.uid;
              blob.name = value.file.name;
              handlePreview(blob, name, onChange, 'image', imgRatio);
              return;
            }
            newFileList.map((fi) => {
              if (fi.name == fileName) {
                fi.originFileObj = file;
              }
              return fi;
            });
            setFileLists({ ...fileLists, [name]: newFileList.slice(0, maxFile || 999) });
            (form || formN).setFieldsValue({
              [name]: { ...value, fileList: newFileList.slice(0, maxFile || 999) },
            });
          });
          if (onChange) onChange(value);
        } else {
          if (!newFileList.length) (form || formN).setFieldsValue({ [name]: undefined });
          else (form || formN).setFieldsValue({ [name]: value });
          setFileLists({ ...fileLists, [name]: newFileList });
        }
      },
    };
  };

  // 预览图片
  const handlePreview = async (file, key, onChange, fileType, imgRatio) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj || file);
    }
    const showFile = file instanceof Blob ? file : file.url || file.preview;
    setPreviewImage(showFile);
    setPreviewTitle({ uid: file.uid, key, onChange, fileType, imgRatio });
    setPreviewVisible(true);
  };

  // 裁剪图片
  const handleCutImg = (file) => {
    const fName = Array.isArray(previewTitle.key)
      ? previewTitle.key[previewTitle.key.length - 1]
      : previewTitle.key;
    const uid = previewTitle.uid;
    let newimg = fileLists[fName] || [];
    imageCompress(file).then(({ file, base64 }) => {
      if (newimg.findIndex((i) => i.uid == uid) === -1) {
        newimg = [...newimg, { uid, url: base64, thumbUrl: base64, originFileObj: file }];
      } else {
        newimg.map((fi) => {
          if (fi.uid === uid) {
            fi.originFileObj = file;
            fi.url = base64;
            fi.thumbUrl = base64;
          }
          return fi;
        });
      }
      setFileLists({ ...fileLists, [fName]: newimg });
      let onwFile = { [fName]: { file, fileList: newimg } };
      if (Array.isArray(previewTitle.key)) {
        onwFile = { [previewTitle.key[0]]: { [previewTitle.key[1]]: { file, fileList: newimg } } };
      }
      (form || formN).setFieldsValue(onwFile);
      previewTitle.onChange && previewTitle.onChange(file);
    });
  };

  const moveRow = (dragIndex, hoverIndex, name) => {
    const dragRow = fileLists[name][dragIndex];
    console.log(dragIndex, hoverIndex, dragRow);
    const movefile = update(fileLists[name], {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ],
    });
    setFileLists({
      ...fileLists,
      [name]: movefile,
    });
    const urlValue = (form || formN).getFieldValue(name);
    if (typeof urlValue === 'string') {
      (form || formN).setFieldsValue({ [name]: movefile.map((i) => i.url).toString() });
    } else {
      (form || formN).setFieldsValue({
        [name]: {
          file: urlValue.file,
          fileList: movefile,
        },
      });
    }
  };

  const manager = useRef(RNDContext);

  // 遍历表单
  const getFields = () => {
    const childrenOwn = [];
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
        hidden = false,
        fieldNames = {},
      } = item;
      let { extra } = item;

      let initialValue = {};
      let rules = item.rules || [{ required: true, message: `请确认${label}` }];
      const placeholder = item.placeholder || `请输入${label}`;
      // Array.isArray(name) ? name[1] : name

      const numtext = Array.isArray(name)
        ? initialValues[name[0]]
          ? initialValues[name[0]][name[1]]
          : ''
        : initialValues[name];
      const dataNum =
        maxLength &&
        `${
          totalNum[Array.isArray(name) ? name[1] : name] || (numtext && `${numtext}`.length) || 0
        }/${maxLength}`;

      // 判断类型 默认input

      let component = {
        input: (
          <Input
            placeholder={placeholder}
            prefix={item.prefix}
            suffix={dataNum || item.suffix || ''}
            maxLength={maxLength}
            addonAfter={item.addonAfter}
            disabled={item.disabled}
            onBlur={item.onBlur}
            onPressEnter={item.onPressEnter}
            onChange={(e) => {
              if (item.onChange) item.onChange(e);
              setTotalNum({
                ...totalNum,
                [Array.isArray(name) ? name[1] : name]: e.target.value.length,
              });
            }}
            style={item.style}
          />
        ),
        number: (
          <InputNumber
            disabled={item.disabled}
            style={{ width: '100%' }}
            placeholder={placeholder}
            max={item.max}
            min={item.min}
            formatter={item.formatter}
            precision={item.precision}
            addonAfter={item.addonAfter}
            prefix={item.prefix}
            suffix={dataNum || item.suffix || ''}
          />
        ),
        textArea: (
          <Input.TextArea
            placeholder={placeholder}
            rows={item.rows || 5}
            disabled={item.disabled}
            maxLength={maxLength}
            onChange={(e) =>
              setTotalNum({
                ...totalNum,
                [Array.isArray(name) ? name[1] : name]: e.target.value.length,
              })
            }
          />
        ),
        timePicker: (
          <TimePicker.RangePicker
            style={{ width: '100%' }}
            format={item.format || 'HH:mm'}
            allowClear={false}
          />
        ),
        dataPicker: <DatePicker style={{ width: '100%' }} />,
        rangePicker: (
          <DatePicker.RangePicker
            disabled={item.disabled}
            style={{ width: '100%' }}
            // defaultPickerValue={[
            //   moment(moment().startOf('month')).subtract(1, 'month'),
            //   moment(moment().startOf('month')).subtract(1, 'day'),
            // ]}
            onChange={item.onChange}
            disabledDate={item.disabledDate}
            // renderExtraFooter={() =>
            //   '开始时间：选择日期的 00：00：00，结束时间：选择日期的 23：59：59'
            // }
          />
        ),
        checkbox: item.loading ? (
          <Spin />
        ) : (
          <Checkbox.Group options={select} onChange={item.onChange} />
        ),
        select: (
          <Select
            labelInValue={item.labelInValue || false}
            mode={item.mode}
            showSearch
            loading={item.loading}
            disabled={item.disabled}
            defaultActiveFirstOption={false}
            dropdownMatchSelectWidth={false}
            filterOption={item.filterOption || true}
            onSearch={item.onSearch}
            onChange={item.onChange}
            notFoundContent={
              item.loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            placeholder={item.placeholder || `请选择${label}`}
            style={{ width: '100%' }}
            optionFilterProp="children"
          >
            {select.map((data, j) => {
              const { labelKey = 'name', valueKey = 'value', tipKey = 'otherData' } = fieldNames;
              if (data) {
                const nameD = data[labelKey];
                // 兼容数组
                const valueData = !data[valueKey] ? `${j}` : data[valueKey];
                const nameData = nameD ? nameD : typeof data == 'string' ? data : '--';
                const otherData = data[tipKey] ? data[tipKey] : '';
                return (
                  <Option key={data.key || j} value={valueData}>
                    {nameData}
                    {otherData && <div style={{ fontSize: 12, color: '#989898' }}>{otherData}</div>}
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
            fieldNames={item.fieldNames}
            options={item.select || CITYJSON}
            expandTrigger="hover"
            disabled={item.disabled}
            changeOnSelect={item.changeOnSelect || false}
            onChange={(val, sele) => {
              (form || formN).setFieldsValue({ [`Cascader${item.name}`]: sele });
              if (item.onChange) item.onChange(sele);
            }}
            showSearch={{
              filter: (inputValue, path) =>
                filter(inputValue, path, item.fieldNames ? item.fieldNames.label : 'label'),
            }}
            placeholder={item.placeholder || `请选择${label}`}
          />
        ),
        switch: <Switch disabled={item.disabled} />,
        upload: (
          <DndProvider manager={manager.current.dragDropManager}>
            <Upload
              // 允许选择时裁剪的时候不允许多选
              multiple={item.isCut ? false : item.multiple || true}
              listType="picture-card"
              fileList={fileLists[Array.isArray(name) ? name[1] : name]}
              beforeUpload={(file) => beforeUpload(file, item.maxSize)}
              onPreview={(file) => handlePreview(file, name, item.onChange, 'image', item.imgRatio)}
              maxCount={item.maxFile}
              {...handleUpProps(
                Array.isArray(name) ? name[1] : name,
                item.onChange,
                item.maxFile,
                item.maxSize,
                item.isCut,
                item.imgRatio,
              )}
              itemRender={(originNode, file, currFileList) => {
                return (
                  <DragableUploadListItem
                    originNode={originNode}
                    file={file}
                    fileList={currFileList}
                    moveRow={(dragIndex, hoverIndex) => moveRow(dragIndex, hoverIndex, name)}
                  />
                );
              }}
            >
              {fileLists[Array.isArray(name) ? name[1] : name] &&
                fileLists[Array.isArray(name) ? name[1] : name].length < (item.maxFile || 999) &&
                uploadButton}
            </Upload>
          </DndProvider>
        ),
        videoUpload: (
          <Upload
            multiple={item.multiple || true}
            listType="picture-card"
            accept="video/mp4,.mp4"
            maxCount={item.maxFile}
            fileList={fileLists[Array.isArray(name) ? name[1] : name]}
            previewFile={(file) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.onerror = (error) => reject(error);
              });
            }}
            onPreview={(file) => handlePreview(file, name, item.onChange, 'video')}
            beforeUpload={(file) => {
              if (file.type !== 'video/mp4') {
                message.error(`${file.name} 不是mp4格式`);
                file.dklFileStatus = 'out';
              }
              return false;
            }}
            onChange={(value) => {
              const keyName = Array.isArray(name) ? name[1] : name;
              const { fileList } = value;
              const newFileList = fileList.filter((file) => file.dklFileStatus !== 'out');
              if ((!value.file.status || value.file.status === 'done') && newFileList.length) {
                setFileLists({
                  ...fileLists,
                  [keyName]: newFileList.slice(0, item.maxFile || 999),
                });
                (form || formN).setFieldsValue({
                  [keyName]: { ...value, fileList: newFileList.slice(0, item.maxFile || 999) },
                });
                if (item.onChange) item.onChange(value);
              } else {
                if (!newFileList.length) (form || formN).setFieldsValue({ [keyName]: undefined });
                else (form || formN).setFieldsValue({ [keyName]: value });
                setFileLists({ ...fileLists, [keyName]: newFileList });
              }
            }}
          >
            {fileLists[Array.isArray(name) ? name[1] : name] &&
              fileLists[Array.isArray(name) ? name[1] : name].length < (item.maxFile || 999) &&
              uploadButton}
          </Upload>
        ),
        childrenOwn: item.childrenOwn,
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
        childrenOwn.push(visible && item.childrenOwn);
        return;
      }

      if (title) {
        childrenOwn.push(
          <Divider orientation="left" key={`${label}${i}`}>
            {title}
          </Divider>,
        );
      }

      const req = {};
      if (item.required) req.required = item.required;
      childrenOwn.push(
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
            normalize={item.normalize} // 组件值转换
            hidden={hidden} // 隐藏表单仍然获取值
            labelCol={item.labelCol}
            wrapperCol={item.wrapperCol}
          >
            {component}
          </FormItem>
        ),
      );
    });
    return childrenOwn;
  };

  useEffect(() => {
    (form || formN).setFieldsValue(initialValues);
    return componentWillUnmount;
  }, [Object.keys(initialValues).length]);

  // 组件销毁执行
  const componentWillUnmount = () => {
    (form || formN).resetFields();
  };

  return (
    <Form
      key={keyValue}
      form={form || formN}
      layout={layout}
      initialValues={initialValues}
      {...formItemLayout}
      {...formItemLayouts}
      scrollToFirstError={true}
    >
      {formItems.length ? getFields() : ''}
      {children}
      <Modal
        destroyOnClose
        title="编辑图片"
        width={950}
        visible={previewVisible && previewTitle.fileType === 'image'}
        maskClosable={false}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        zIndex={100000}
      >
        <ImgCutView
          uploadedImageFile={previewImage}
          onSubmit={handleCutImg}
          imgRatio={previewTitle.imgRatio}
          onClose={() => setPreviewVisible(false)}
        />
      </Modal>
      <Modal
        title={'查看'}
        visible={previewVisible && previewTitle.fileType === 'video'}
        onCancel={() => setPreviewVisible(false)}
        width={548}
        footer={null}
        zIndex={100000}
      >
        <video
          controls="controls"
          style={{ maxHeight: 300, margin: '0 auto', width: 500 }}
          autoPlay
          src={previewImage}
        >
          <track kind="captions" />
        </video>
      </Modal>
    </Form>
  );
};

export default FormComponents;
