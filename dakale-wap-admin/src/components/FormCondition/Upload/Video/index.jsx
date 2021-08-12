import React, { useState, useRef } from 'react';
import { Upload, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 上传文件按钮
const uploadButton = (
  <div>
    <Button icon={<PlusOutlined />}>选择</Button>
  </div>
);

// 文件默认值
const imgUrl = (url, uid) => ({
  uid: `-${uid}`,
  name: url,
  status: 'done',
  url,
});

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

// 数据数组还原
const uploadValues = (fileArr) => {
  return !Array.isArray(fileArr)
    ? fileArr && fileArr.length > 0
      ? fileArr.indexOf(',') > -1
        ? fileArr.split(',').map((v, i) => imgUrl(v, i))
        : [imgUrl(fileArr, fileArr)]
      : []
    : fileArr.map((v, i) => imgUrl(v, i));
};

const UploadBlock = (props) => {
  const {
    form,
    initialvalues: initialValues,
    name = '',
    multiple = true,
    onRemove,
    maxFile,
    onChange,
  } = props;

  const videoRef = useRef(null);

  const fileKeyName = Array.isArray(name) ? name[1] : name;

  const [previewVisible, setPreviewVisible] = useState(false); // 回显弹窗显示隐藏
  const [previewUrl, setPreviewUrl] = useState(''); // 回显 url
  // 文件控制列表
  const [fileLists, setFileLists] = useState(() => {
    if (initialValues && Object.keys(initialValues).length) {
      // 键名是数组的情况
      if (Array.isArray(name)) {
        const urlfile = getArrKeyVal(name, initialValues);
        return urlfile ? uploadValues(urlFile) : [];
      }
      // 键名是字符串的情况
      const fileArrar = initialValues[fileKeyName];
      if (fileArrar && !!fileArrar.fileList) return fileArrar.fileList;
      return uploadValues(fileArrar);
    } else {
      return [];
    }
  });

  // 查看视频
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj || file);
    }
    const showFile = file.url || file.preview;
    setPreviewUrl(showFile);
    setPreviewVisible(true);
  };

  // 关闭 暂停播放
  const handleVideoClose = () => {
    videoRef.current.pause();
    setPreviewVisible(false);
  };

  return (
    <>
      <Upload
        multiple={multiple}
        onRemove={onRemove}
        listType="picture"
        accept="video/mp4,.mp4"
        maxCount={maxFile}
        fileList={fileLists}
        previewFile={() => {
          return new Promise((resolve) => {
            resolve('url.mp4');
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
        visible={previewVisible}
        width={548}
        footer={null}
        zIndex={100000}
        destroyOnClose
        onCancel={handleVideoClose}
      >
        <video
          controls="controls"
          style={{ maxHeight: 300, margin: '0 auto', width: 500 }}
          ref={videoRef}
          autoPlay
          src={previewUrl}
        >
          <track kind="captions" />
        </video>
      </Modal>
    </>
  );
};

export default UploadBlock;
