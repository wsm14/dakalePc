import React, { useState } from 'react';
import { Descriptions, Image } from 'antd';
import styles from './index.less';

/**
 *
 * 描述列表封装
 * 2020年8月4日 15:35:24 Dong
 *
 * @formItems 表单内容数组
 * @initialValues 默认值
 */

// 图片默认值
const imgold = (url, uid, name) => ({
  uid: `-${uid}`,
  name,
  status: 'done',
  url,
});

const DescriptionsCondition = ({ formItems = [], initialValues, title, column, style }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 图片获取预览base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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

  /**
   * 查看图片
   * @param {*} fileObj 图片路径
   */
  const handleProps = (fileObj = '', name) => {
    if (fileObj.indexOf(',') > -1) {
      fileObj = fileObj.split(',');
    }
    return {
      showUploadList: {
        showRemoveIcon: false,
      },
      openFileDialogOnClick: false,
      listType: 'picture-card',
      fileList: Array.isArray(fileObj)
        ? fileObj.map((url, i) => imgold(url, i, name))
        : fileObj.length > 0
        ? [imgold(fileObj, fileObj, name)]
        : [],
      onPreview: handlePreview,
    };
  };

  /**
   * 查看图片
   * @param {*} fileObj 图片路径
   */
  const imgShow = (fileObj = '') => {
    if (fileObj.indexOf(',') > -1) {
      fileObj = fileObj.split(',');
    }
    let imgComponent = '';
    const imgCom = (url) => (
      <Image key={url} width={104} height={104} src={url} className={styles.descript_img} />
    );
    if (Array.isArray(fileObj)) {
      imgComponent = fileObj.map((url) => imgCom(url));
    } else if (fileObj.length > 0) {
      imgComponent = imgCom(fileObj);
    }
    return <Image.PreviewGroup>{imgComponent}</Image.PreviewGroup>;
    // <Upload
    //   {...handleProps(
    //     item.initialValue ? item.initialValue : initialValues[item.name],
    //     item.label,
    //   )}
    // />
  };

  // 遍历表单
  const getFields = () =>
    formItems.map((item, i) => {
      // visible true 则显示 hidden false 显示 show true显示
      // visible 和表单共用 hidden 和表单相反 show 独有
      const { show = true, visible = true, hidden = false } = item;
      return (
        show &&
        visible &&
        !hidden && (
          <Descriptions.Item
            label={item.label}
            key={`${item.label}${i}`}
            className={styles.descriptions_item}
          >
            {initialValues
              ? item.render
                ? item.render(initialValues[item.name], initialValues)
                : item.type === 'upload'
                ? imgShow(item.initialValue ? item.initialValue : initialValues[item.name])
                : item.initialValue
                ? item.initialValue
                : Array.isArray(item.name)
                ? initialValues[item.name[0]][item.name[1]]
                : initialValues[item.name]
              : ''}
            {item.children && <div>{item.children}</div>}
          </Descriptions.Item>
        )
      );
    });

  return (
    <>
      <Descriptions
        title={title}
        className={styles.descriptions_box}
        bordered
        column={column || 1}
        size="small"
        style={style}
      >
        {formItems.length ? getFields() : ''}
      </Descriptions>
      {/* <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        zIndex={1009}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
    </>
  );
};

export default DescriptionsCondition;
