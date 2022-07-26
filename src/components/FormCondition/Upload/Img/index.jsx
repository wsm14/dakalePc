import React, { useState, useRef } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';
import DragAndDropHOC from '@/components/DndDragContext/DragAndDropHOC';
import update from 'immutability-helper';
import imageCompress from '@/utils/imageCompress';
// import ImgCutView from '@/components/ImgCut';
import './index.less';

// 图片拖动
const DragableUploadListItem = ({ originNode, moveRow, file, fileList, fileKeyName }) => {
  const ref = useRef();
  const index = fileList.indexOf(file);
  // accept 拖拽对象落点的属性 区分拖拽对象的不同落点区域 与useDrag type对应
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: fileKeyName,
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
  // type 拖拽对象落点的属性 区分拖拽对象的不同落点区域 与useDrop accept对应
  const [, drag] = useDrag({
    item: { type: fileKeyName, index },
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

// 上传文件按钮
const uploadButton = (
  <div>
    <PlusOutlined />
    <div className="ant-upload-text">选择</div>
  </div>
);

// 图片默认值
const imgUrl = (url, uid) => ({
  uid: `-${uid}`,
  name: url,
  status: 'done',
  url,
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

// 图片数据数组还原
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
    maxFile,
    maxSize,
    onChange = undefined,
    onRemove,
    isCut = false,
    drop = true,
    // imgRatio,
    disabled,
    multiple = true,
    listType = 'picture-card',
    children,
  } = props;

  const fileKeyName = Array.isArray(name)
    ? typeof name[1] === 'number'
      ? name[2]
      : name[1]
    : name;

  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显弹窗显示隐藏
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 属性
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

  // 查看图片视频
  const handlePreview = async (file) => {
    const { originFileObj } = file;
    const fileExtr = (originFileObj || file).name.replace(/.+\./, '.').toLowerCase();
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj || file);
    }
    const showFile =
      fileExtr === '.gif' || !isCut
        ? file.url || file.preview
        : file.originFileObj
        ? file.originFileObj
        : file.url || file.preview;
    setPreviewImage(showFile);
    setPreviewTitle({ uid: file.uid, key: name, fileType: fileExtr });
    setPreviewVisible(true);
  };

  // 裁剪图片
  const handleCutImg = (file) => {
    const fName = Array.isArray(previewTitle.key)
      ? previewTitle.key[previewTitle.key.length - 1]
      : previewTitle.key;
    const uid = previewTitle.uid;
    let newimg = fileLists || [];
    imageCompress(file, maxSize).then(({ file }) => {
      const thumbUrl = URL.createObjectURL(file);
      if (newimg.findIndex((i) => i.uid == uid) === -1) {
        newimg = [...newimg, { uid, url: thumbUrl, thumbUrl, originFileObj: file }];
      } else {
        newimg.map((fi) => {
          if (fi.uid === uid) {
            fi.originFileObj = file;
            fi.url = thumbUrl;
            fi.thumbUrl = thumbUrl;
          }
          return fi;
        });
      }
      setFileLists(newimg);
      onChange && onChange(file);
      form && form.setFieldsValue(checkArrKeyVal(name, newimg, maxFile, 'fileList'));
    });
  };

  // 移动文件
  const moveRow = (dragIndex, hoverIndex) => {
    const dragRow = fileLists[dragIndex];
    console.log(dragIndex, hoverIndex, dragRow);
    const movefile = update(fileLists, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ],
    });
    setFileLists(movefile);
    const urlValue = form.getFieldValue(name);
    if (typeof urlValue === 'string') {
      form && form.setFieldsValue(checkArrKeyVal(name, movefile.map((i) => i.url).toString()));
    } else {
      form && form.setFieldsValue(checkArrKeyVal(name, movefile, maxFile, 'fileList'));
    }
  };

  // 上传文件限制
  const beforeUpload = (file) => {
    if (!maxSize) return false;
    const isLt1M = file.size / 1024 < maxSize;
    if (!isLt1M) {
      message.error(`上传图片过大，请小于${maxSize}KB！`);
      // 图片过大 不允许上传 dklFileStatus 返回out
      // 默认可上传 dklFileStatus 不存在
      file.dklFileStatus = 'out';
    }
    return false;
  };

  /**
   * 选择图片上传配置
   */
  const handleUpProps = () => {
    const onPreview = disabled ? {} : { onPreview: (file) => !disabled && handlePreview(file) };
    return {
      accept: 'image/*',
      ...onPreview,
      onRemove,
      onChange: (value) => {
        const { fileList } = value;
        const newFileList = !maxSize
          ? fileList
          : // dklFileStatus  === out 的值 不允许上传
            fileList.filter((file) => file.dklFileStatus !== 'out');
        if ((!value.file.status || value.file.status === 'done') && newFileList.length) {
          // const fileExtr = value.file.name.replace(/.+\./, '.').toLowerCase();
          // 是否传入时裁剪 git不允许裁剪
          // if ((imgRatio || isCut) && fileExtr !== '.gif') {
          //   imageCompress(value.file.originFileObj || value.file).then(({ blob }) => {
          //     blob.uid = value.file.uid;
          //     blob.name = value.file.name;
          //     handlePreview(blob);
          //     return;
          //   });
          //   return;
          // }
          setFileLists(newFileList.slice(0, maxFile || 999));
          form && form.setFieldsValue(checkArrKeyVal(name, newFileList, maxFile, 'fileList'));
          if (onChange) onChange(value);
        } else {
          if (!newFileList.length) form && form.setFieldsValue(checkArrKeyVal(name, undefined));
          else form && form.setFieldsValue(checkArrKeyVal(name, newFileList, maxFile, 'fileList'));
          setFileLists(newFileList);
        }
      },
    };
  };

  return (
    <>
      <DragAndDropHOC>
        <Upload
          disabled={disabled}
          // 允许选择时裁剪的时候不允许多选
          multiple={isCut ? false : multiple}
          listType={listType}
          fileList={fileLists}
          beforeUpload={(file) => beforeUpload(file)}
          maxCount={maxFile}
          {...handleUpProps()}
          itemRender={(originNode, file, currFileList) => {
            if (!drop) return originNode;
            return (
              <DragableUploadListItem
                originNode={originNode}
                file={file}
                fileList={currFileList}
                moveRow={(dragIndex, hoverIndex) => moveRow(dragIndex, hoverIndex)}
                fileKeyName={fileKeyName}
              />
            );
          }}
        >
          {fileLists && fileLists.length < (maxFile || 999) && (children || uploadButton)}
        </Upload>
      </DragAndDropHOC>
      <Modal
        destroyOnClose
        title={'查看图片'}
        // title={previewTitle.fileType === '.gif' || isCut === false ? '查看图片' : '编辑图片'}
        width={950}
        visible={previewVisible}
        maskClosable
        // maskClosable={previewTitle.fileType === '.gif' || isCut === false}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        zIndex={100000}
      >
        <div style={{ textAlign: 'center' }}>
          <img src={previewImage} alt="" srcset="" style={{ width: '100%' }} />
        </div>
        {/* {previewTitle.fileType === '.gif' || isCut === false ? (
          <div style={{ textAlign: 'center' }}>
            <img src={previewImage} alt="" srcset="" style={{ width: '100%' }} />
          </div>
        ) : (
          <ImgCutView
            uploadedImageFile={previewImage}
            onSubmit={handleCutImg}
            imgRatio={imgRatio}
            onClose={() => setPreviewVisible(false)}
          />
        )} */}
      </Modal>
    </>
  );
};

export default UploadBlock;
