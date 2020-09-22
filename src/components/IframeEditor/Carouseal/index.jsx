import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Tabs, Form, Input, Upload, Button, Space, Modal } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UpSquareOutlined,
  DownSquareOutlined,
} from '@ant-design/icons';
import aliOssUpload from '@/utils/aliOssUpload';
import ImgCutView from '@/components/ImgCut';
import imageCompress from '@/utils/imageCompress';
import SourceSet from './source';
import styles from './index.less';

// 全局校验说明
const validateMessages = {
  required: '请上传图片',
};

// 图片默认值
const imgold = (url, uid) => ({
  uid: `-${uid}`,
  name: 'image.png',
  status: 'done',
  url,
});

const Carouseal = (props) => {
  const { form, initialValues, showPanel, cRef } = props;

  const [tabs, setTabs] = useState(initialValues && initialValues.apiUrl ? '2' : '1');
  const [imgcut, setImgcut] = useState({ file: {}, visible: false });
  const [previewVisible, setPreviewVisible] = useState(false); // 图片回显
  const [previewImage, setPreviewImage] = useState(''); // 图片回显 url
  const [previewTitle, setPreviewTitle] = useState(''); // 图片回显 标题
  const [fileLists, setFileLists] = useState(() => {
    if (!initialValues || initialValues.apiUrl) return {};
    const fileobj = initialValues.map((item, i) => [imgold(item.data, i)]);
    return { ...fileobj };
  }); // 文件控制列表

  // 预览图片
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setPreviewVisible(true);
  };

  // 图片获取预览base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCutImg = (name) => (file) => {
    const fName = name;
    const newimg = fileLists[fName];
    imageCompress(file).then(({ file, base64 }) => {
      newimg[newimg.length - 1].originFileObj = file;
      newimg[newimg.length - 1].thumbUrl = base64;
      setFileLists({ ...fileLists, [fName]: newimg });
    });
  };

  const handleCloseCut = (name, file = false) => {
    if (typeof file !== 'boolean') {
      setFileLists({ ...fileLists, [name]: undefined });
      form.getFieldValue('content')[name].data = undefined;
    }
    setImgcut({ file: {}, visible: false });
  };

  /**
   * 选择图片上传配置
   */
  const handleUpProps = (name) => {
    return {
      accept: 'image/*',
      onChange: (value) => {
        const { fileList } = value;
        if (!value.file.status) {
          imageCompress(value.file).then(({ file }) => {
            fileList[fileList.length - 1].originFileObj = file;
            setImgcut({
              file,
              fileRido: 375 / showPanel.height,
              visible: true,
              name,
            });
          });
          setFileLists({ ...fileLists, [name]: fileList });
        } else {
          form.getFieldValue('content')[name].data = undefined;
          setFileLists({ ...fileLists, [name]: undefined });
        }
      },
    };
  };

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((values) => {
        if (!values.apiUrl) {
          const fileArr = values.content.map((item) => {
            if (typeof item.data === 'string') return item.data;
            else return item.data.fileList[0].originFileObj;
          });
          return aliOssUpload(fileArr).then((res) => {
            const newdata = values.content.map((item, i) => ({ ...item, data: res[i].toString() }));
            return newdata;
          });
        } else {
          return values;
        }
      });
    },
  }));

  useEffect(() => {
    return componentWillUnmount;
  }, []);

  // 组件销毁执行
  const componentWillUnmount = () => {
    form.resetFields();
  };

  return (
    <>
      <Tabs type="card" onChange={setTabs} activeKey={tabs}>
        <Tabs.TabPane tab="自定义" key="1">
          {tabs == 1 && (
            <Form
              form={form}
              initialValues={initialValues ? { content: initialValues } : {}}
              layout="vertical"
              validateMessages={validateMessages}
            >
              <Form.List name="content">
                {(fields, { add, remove, move }) => {
                  return (
                    <>
                      {fields.map((field, i) => (
                        <Space key={field.key} className={styles.ifame_carouseal} align="baseline">
                          <div className={styles.ifame_btnArr}>
                            <UpSquareOutlined
                              onClick={() => {
                                move(field.name, field.name - 1);
                              }}
                            />
                            <DownSquareOutlined
                              onClick={() => {
                                move(field.name, field.name + 1);
                              }}
                            />
                          </div>
                          <Form.Item
                            name={[field.name, 'data']}
                            fieldKey={[field.fieldKey, 'data']}
                            rules={[{ required: true }]}
                          >
                            <Upload
                              listType="picture-card"
                              fileList={fileLists[field.key]}
                              beforeUpload={() => false}
                              onPreview={handlePreview}
                              {...handleUpProps(field.key)}
                            >
                              {!fileLists[field.key] && <PlusOutlined />}
                            </Upload>
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'link']}
                            fieldKey={[field.fieldKey, 'link']}
                          >
                            <Input placeholder="输入合法链接" />
                          </Form.Item>
                          {fields.length > 1 && (
                            <MinusCircleOutlined
                              style={{ marginBottom: 8 }}
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          )}
                        </Space>
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
            </Form>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="数据源" key="2">
          {tabs == 2 && <SourceSet form={form} initialValues={initialValues}></SourceSet>}
        </Tabs.TabPane>
      </Tabs>
      <Modal
        title={previewTitle}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        zIndex={1009}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal
        destroyOnClose
        title="裁剪图片"
        width={950}
        visible={imgcut.visible}
        maskClosable={false}
        closable={false}
        footer={null}
      >
        <ImgCutView
          imgRatio={imgcut.fileRido || NaN}
          uploadedImageFile={imgcut.file}
          onSubmit={handleCutImg(imgcut.name)}
          onClose={(file) => handleCloseCut(imgcut.name, file)}
        />
      </Modal>
    </>
  );
};

export default Carouseal;
