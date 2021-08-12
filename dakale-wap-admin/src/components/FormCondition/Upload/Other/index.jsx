import React, { useState } from 'react';
import { Upload, Button } from 'antd';

// 文件默认值
const imgold = (url, uid) => ({
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

const UploadBlock = (props) => {
  const { form, initialvalues: initialValues, name = '', maxFile, onChange } = props;
  const fileKeyName = Array.isArray(name) ? name[1] : name;

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
