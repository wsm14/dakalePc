import React, { useImperativeHandle, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Modal } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import imageCompress from '@/utils/imageCompress';
import EditorForm from '../editorForm';
import FormList from './FormList';
import '../index.less';

// 回显dom
const showDom = [];

// 图片默认值
const imgold = (url, uid) => ({
  uid: `-${uid}`,
  name: 'image.png',
  status: 'done',
  url,
});

/**
 * 轮播图配置
 */
const Carouseal = (props) => {
  const { value, editorType, cRef } = props;

  const [form] = Form.useForm();

  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 标题
  const [fileLists, setFileLists] = useState(() => {
    if (!value || value.apiUrl) return {};
    const fileobj = value.map((item, i) => [imgold(item.data, i)]);
    return { ...fileobj };
  }); // 文件控制列表

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: async () => {
      const values = await form.validateFields();
      const { content } = values;
      const fileArr = content.map((item) => {
        if (typeof item.img === 'string') return item.img;
        else return item.img.fileList[0].originFileObj;
      });
      const res = await aliOssUpload(fileArr);
      const newdata = content.map((item_1, i) => ({ ...item_1, img: res[i].toString() }));
      return newdata;
    },
  }));

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
   * 选择图片上传配置
   */
  const handleUpProps = (name) => {
    return {
      accept: 'image/*',
      onChange: (fileArr) => {
        const { fileList } = fileArr;
        if (!fileArr.file.status) {
          imageCompress(fileArr.file).then(({ file }) => {
            fileList[fileList.length - 1].originFileObj = file;
          });
          setFileLists({ ...fileLists, [name]: fileList });
        } else {
          form.getFieldValue('content')[name].data = undefined;
          setFileLists({ ...fileLists, [name]: undefined });
        }
      },
    };
  };

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      <div className="active_title_msg">图片大小请保持一致，否则将显示异常，高度自适应</div>
      <EditorForm initialValues={value || {}} form={form}>
        <Form.List name="content">
          {(fields, { add, remove, move }) => {
            return (
              <>
                {fields.map((field, i) => (
                  <FormList
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    fileLists={fileLists}
                    remove={remove}
                    move={move}
                    handlePreview={handlePreview}
                    handleUpProps={handleUpProps}
                  ></FormList>
                ))}
                <Form.Item>
                  <Button
                    disabled={fields.length === 5}
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> {fields.length} / {5} 添加
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </EditorForm>
      <Modal
        title={previewTitle}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        zIndex={1009}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

Carouseal.dom = showDom;

export default Carouseal;
