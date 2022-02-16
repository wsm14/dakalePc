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

/**
 * 还原数组对象
 * @param {*} keyArr 键名
 * @param {*} val 键值
 * @param {*} maxFile 最大文件数默认999
 * @param {*} valueKey 最后一层值键名 不传递则 返回原始值 传递返回 { [valueKey]: val }
 * @returns
 */
const checkArrKeyVal = (keyArr, val, maxFile, valueKey) => {
  if (!keyArr) return;
  const newObj = {};
  let newVal = valueKey ? { [valueKey]: val.slice(0, maxFile || 999) } : val;
  if (Array.isArray(keyArr)) {
    for (let index = keyArr.length - 1; index >= 0; index--) {
      if (index === keyArr.length - 1) {
        newVal = { [`${keyArr[index]}`]: newVal };
      } else {
        newObj[keyArr[index]] = newVal;
      }
    }
    return newObj;
  } else {
    newObj[keyArr] = newVal;
    return newObj;
  }
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
        const urlFile = getArrKeyVal(name, initialValues);
        return urlFile ? uploadValues(urlFile) : [];
      }
      // 键名是字符串的情况
      const fileArrar = initialValues[fileKeyName];
      if (fileArrar && !!fileArrar.fileList) return fileArrar.fileList;
      return uploadValues(fileArrar);
    } else {
      return [];
    }
  });

  console.log(fileLists);

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
            return false;
          }
          let maxSize = 10;
          const fileurl = URL.createObjectURL(file);
          // 获取视频的时长
          const audioElement = new Audio(fileurl);
          audioElement.addEventListener('loadedmetadata', function (_event) {
            const duration = audioElement.duration;
            console.log(duration); //单位：秒
            if (duration > 30) maxSize = 20;
            const isLt1M = file.size / 1024 / 1024 < maxSize;
            if (!isLt1M) {
              message.error(`30s以内不能超过10M， 30秒以上不能超过20M`);
              file.dklFileStatus = 'out';
              form.setFieldsValue(checkArrKeyVal(name, undefined));
            }
          });
          return false;
        }}
        onChange={(value) => {
          const { fileList } = value;
          const newFileList = fileList.filter((file) => file.dklFileStatus !== 'out');
          if ((!value.file.status || value.file.status === 'done') && newFileList.length) {
            const newData = newFileList.slice(0, maxFile || 999);
            setFileLists(newData);
            form.setFieldsValue(checkArrKeyVal(name, newData, maxFile, 'fileList'));
            if (onChange) onChange(value);
          } else {
            if (!newFileList.length) form.setFieldsValue(checkArrKeyVal(name, undefined));
            else form.setFieldsValue(checkArrKeyVal(name, value));
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
