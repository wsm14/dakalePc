import React, { useState } from 'react';
import { Upload } from 'antd';

// 文件默认值
const imgold = (url, uid) => ({
  uid: `-${uid}`,
  name: url,
  status: 'done',
  url,
});

const UploadBlock = (props) => {
  const { form, initialValues, name = '', maxFile, onChange } = props;
  const fileKeyName = Array.isArray(name) ? name[1] : name;

  // 文件控制列表
  const [fileLists, setFileLists] = useState(() => {
    if (initialValues && Object.keys(initialValues).length) {
      // 键名是数组的情况
      if (Array.isArray(name)) {
        if (!initialValues[name[0]]) {
          return [];
        }
        const urlfile = initialValues[name[0]][name[1]];
        return urlfile ? [imgold(urlfile, urlfile)] : [];
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
          setFileLists({ ...fileLists, [fileKeyName]: newFileList });
        }
      }}
    >
      {fileLists && fileLists.length < (maxFile || 999) && <Button>选择文件</Button>}
    </Upload>
  );
};

export default UploadBlock;
