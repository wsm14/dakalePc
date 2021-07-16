import React, { useImperativeHandle, useState } from 'react';
import { Form, Button } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';
import FormList from './formList';
import '../index.less';

// 回显dom
const showDom = [];

/**
 * 轮播图配置
 */
const Carouseal = (props) => {
  const { value = {}, editorType, cRef } = props;

  const [form] = Form.useForm();

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

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        return aliOssUpload(content.data).then((res) => {
          return { ...content, editorType, data: res.toString() };
        });
      });
    },
  }));

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      <div className="active_title_msg">图片大小请保持一致，否则将显示异常，高度自适应</div>
      <EditorForm initialValues={value || []} form={form}>
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
    </div>
  );
};

Carouseal.dom = showDom;

export default Carouseal;
