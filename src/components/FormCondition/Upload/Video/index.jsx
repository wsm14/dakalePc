import React, { useState } from 'react';
import { Upload, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 上传文件按钮
const uploadButton = (
  <div>
    <Button icon={<PlusOutlined />}>选择</Button>
  </div>
);

// 文件默认值
const imgold = (url, uid) => ({
  uid: `-${uid}`,
  name: url,
  status: 'done',
  url,
});

// 获取预览base64
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// 逐级获取value
const getArrKeyVal = (key, value) => {
  const _len = key.length;
  let newVal = value;
  for (let _key = 0; _key < _len; _key++) {
    // 当数组key 获取值时某一层不存在时直接返回null
    const valGet = newVal ? newVal[key[_key]] : null;
    newVal = valGet ? valGet : undefined;
  }
  return newVal;
};

const UploadBlock = (props) => {
  const { form, initialvalues: initialValues, name = '', multiple, maxFile, onChange } = props;
  const fileKeyName = Array.isArray(name) ? name[1] : name;

  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显弹窗显示隐藏
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 属性
  // 文件控制列表
  const [fileLists, setFileLists] = useState(() => {
    if (initialValues && Object.keys(initialValues).length) {
      // 键名是数组的情况
      if (Array.isArray(name)) {
        const urlfile = getArrKeyVal(name, initialValues);

        return urlfile ? (urlfile.fileList ? urlfile.fileList : [imgold(urlfile, urlfile)]) : [];
      }
      // 键名是字符串的情况
      const fileArrar = initialValues[fileKeyName];
      if (fileArrar && !!fileArrar.fileList) return fileArrar.fileList;
      return !Array.isArray(fileArrar)
        ? fileArrar && fileArrar.length > 0
          ? fileArrar.indexOf(',') > -1
            ? fileArrar.split(',').map((v, i) => imgold(v, i))
            : [imgold(fileArrar, fileArrar)]
          : []
        : fileArrar.map((v, i) => imgold(v, i));
    } else {
      return [];
    }
  });

  // 查看图片视频
  const handlePreview = async (file, fileType) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj || file);
    }
    const showFile = file.url || file.preview;
    setPreviewImage(showFile);
    setPreviewTitle({ uid: file.uid, key: name, fileType });
    setPreviewVisible(true);
  };

  return (
    <>
      <Upload
        multiple={multiple || true}
        listType="picture"
        accept="video/mp4,.mp4"
        maxCount={maxFile}
        fileList={fileLists}
        previewFile={(file) => {
          return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            if (url) {
              resolve('url.mp4');
            } else {
              reject('文件错误');
            }
          });
        }}
        onPreview={(file) => handlePreview(file, 'video')}
        beforeUpload={(file) => {
          if (file.type !== 'video/mp4') {
            message.error(`${file.name} 不是mp4格式`);
            file.dklFileStatus = 'out';
          }
          return false;
        }}
        onChange={(value) => {
          const { fileList } = value;
          const newFileList = fileList.filter((file) => file.dklFileStatus !== 'out');
          if ((!value.file.status || value.file.status === 'done') && newFileList.length) {
            const newData = newFileList.slice(0, maxFile || 999);
            setFileLists(newData);
            form.setFieldsValue({ [fileKeyName]: { ...value, fileList: newData } });
            if (onChange) onChange(value);
          } else {
            if (!newFileList.length) form.setFieldsValue({ [fileKeyName]: undefined });
            else form.setFieldsValue({ [fileKeyName]: value });
            setFileLists(newFileList);
          }
        }}
      >
        {fileLists && fileLists.length < (maxFile || 999) && uploadButton}
      </Upload>
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
    </>
  );
};

export default UploadBlock;
