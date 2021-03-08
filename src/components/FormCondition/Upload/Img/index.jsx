import React, { useState, useRef } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import imageCompress from '@/utils/imageCompress';
import ImgCutView from '@/components/ImgCut';
import './index.less';

const RNDContext = createDndContext(HTML5Backend);

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
const imgold = (url, uid) => ({
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

const UploadBlock = (props) => {
  const {
    form,
    initialvalues: initialValues,
    name = '',
    maxFile,
    maxSize,
    dataOnChange: onChange = undefined,
    isCut,
    imgRatio,
    multiple,
  } = props;

  const fileKeyName = Array.isArray(name) ? name[1] : name;

  const manager = useRef(RNDContext);

  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显弹窗显示隐藏
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 属性

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

  // 查看图片视频
  const handlePreview = async (file, fileType) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj || file);
    }
    const showFile = file.originFileObj ? file.originFileObj : file.url || file.preview;
    setPreviewImage(showFile);
    setPreviewTitle({ uid: file.uid, key: name, fileType });
    setPreviewVisible(true);
  };

  // 裁剪图片
  const handleCutImg = (file) => {
    const fName = Array.isArray(previewTitle.key)
      ? previewTitle.key[previewTitle.key.length - 1]
      : previewTitle.key;
    const uid = previewTitle.uid;
    let newimg = fileLists || [];
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
      setFileLists(newimg);
      let onwFile = { [fName]: { file, fileList: newimg } };
      if (Array.isArray(previewTitle.key)) {
        onwFile = { [previewTitle.key[0]]: { [previewTitle.key[1]]: { file, fileList: newimg } } };
      }
      onChange && onChange(file);
      form.setFieldsValue({ ...onwFile });
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
    const urlValue = form.getFieldValue(fileKeyName);
    if (typeof urlValue === 'string') {
      form.setFieldsValue({ [fileKeyName]: movefile.map((i) => i.url).toString() });
    } else {
      form.setFieldsValue({
        [fileKeyName]: {
          file: urlValue.file,
          fileList: movefile,
        },
      });
    }
  };

  // 上传文件限制
  const beforeUpload = (file) => {
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
   */
  const handleUpProps = () => {
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
            // 是否传入时裁剪
            if (isCut) {
              blob.uid = value.file.uid;
              blob.name = value.file.name;
              handlePreview(blob, 'image');
              return;
            }
            newFileList.map((fi) => {
              if (fi.name == fileName) {
                fi.originFileObj = file;
              }
              return fi;
            });
            setFileLists(newFileList.slice(0, maxFile || 999));
            form.setFieldsValue({
              [fileKeyName]: { ...value, fileList: newFileList.slice(0, maxFile || 999) },
            });
          });
          if (onChange) onChange(value);
        } else {
          if (!newFileList.length) form.setFieldsValue({ [fileKeyName]: undefined });
          else form.setFieldsValue({ [fileKeyName]: value });
          setFileLists(newFileList);
        }
      },
    };
  };

  return (
    <>
      <DndProvider manager={manager.current.dragDropManager}>
        <Upload
          // 允许选择时裁剪的时候不允许多选
          multiple={isCut ? false : multiple || true}
          listType="picture-card"
          fileList={fileLists}
          beforeUpload={(file) => beforeUpload(file)}
          onPreview={(file) => handlePreview(file, 'image')}
          maxCount={maxFile}
          {...handleUpProps()}
          itemRender={(originNode, file, currFileList) => {
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
          {fileLists && fileLists.length < (maxFile || 999) && uploadButton}
        </Upload>
      </DndProvider>
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
          imgRatio={imgRatio}
          onClose={() => setPreviewVisible(false)}
        />
      </Modal>
    </>
  );
};

export default UploadBlock;
