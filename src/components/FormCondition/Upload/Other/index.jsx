import React, { useState } from 'react';
import { Upload, Button } from 'antd';

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
  const { form, initialvalues: initialValues, name = '', maxFile, onChange } = props;
  const fileKeyName = Array.isArray(name) ? name[1] : name;

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

  return (
    <Upload
      multiple={false}
      listType="picture"
      maxCount={maxFile || 1}
      fileList={fileLists}
      beforeUpload={() => false}
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
      {fileLists && fileLists.length < (maxFile || 999) && <Button>选择文件</Button>}
    </Upload>
  );
};

export default UploadBlock;
