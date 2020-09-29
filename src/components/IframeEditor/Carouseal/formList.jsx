import React, { useState } from 'react';
import { Form, Input, Radio, Upload, Button, Space, Select } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UpSquareOutlined,
  DownSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';


const Carouseal = (props) => {
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
      form.getFieldValue('content')[name].data = undefined;
      setFileLists({ ...fileLists, [name]: undefined });
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

  return (
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
                  style={{ flex: 1 }}
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
                <Form.Item shouldUpdate>
                  {({ getFieldValue }) => {
                    const linkType = getFieldValue('content')[field.name];
                    return (
                      <div
                        style={{
                          height: linkType && linkType.path === 'goMerchantBox' ? 120 : 'auto',
                        }}
                      >
                        <Form.Item
                          name={[field.name, 'linkType']}
                          fieldKey={[field.fieldKey, 'linkType']}
                        >
                          <Radio.Group
                            onChange={() => {
                              const saveData = form.getFieldValue('content')[field.name];
                              if (!saveData) form.getFieldValue('content')[field.name] = {};
                              form.getFieldValue('content')[field.name].path = undefined;
                            }}
                          >
                            <Radio value="">无</Radio>
                            <Radio value="h5">h5</Radio>
                            <Radio value="native">App页面</Radio>
                          </Radio.Group>
                        </Form.Item>
                        {linkType &&
                          {
                            '': null,
                            h5: (
                              <Form.Item
                                name={[field.name, 'path']}
                                fieldKey={[field.fieldKey, 'path']}
                              >
                                <Input
                                  placeholder="输入合法链接"
                                  addonAfter={
                                    <SearchOutlined
                                      onClick={() =>
                                        setVisibleUrl({
                                          show: true,
                                          key: field.name,
                                        })
                                      }
                                    />
                                  }
                                />
                              </Form.Item>
                            ),
                            native: (
                              <Form.Item
                                name={[field.name, 'path']}
                                fieldKey={[field.fieldKey, 'path']}
                              >
                                <Select
                                  showSearch
                                  defaultActiveFirstOption={false}
                                  optionFilterProp="children"
                                  placeholder="请选择"
                                  style={{ width: '100%' }}
                                  onChange={(value) => {
                                    if (value === 'goMerchantBox')
                                      setVisibleMerchant({
                                        show: true,
                                        key: field.name,
                                      });
                                  }}
                                >
                                  {NATIVE_PATH_TYPE.map((data) => {
                                    return (
                                      <Select.Option key={data.value} value={data.value}>
                                        {data.name}
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                            ),
                          }[linkType.linkType]}
                        {linkType && linkType.path === 'goMerchantBox' ? (
                          <Form.Item
                            name={[field.name, 'param']}
                            rules={[{ required: true }]}
                            fieldKey={[field.fieldKey, 'param']}
                          >
                            <Input
                              placeholder="数据"
                              disabled={true}
                              addonAfter={
                                <SearchOutlined
                                  onClick={() => {
                                    setVisibleMerchant({ show: true, key: field.name });
                                  }}
                                />
                              }
                            />
                          </Form.Item>
                        ) : null}
                      </div>
                    );
                  }}
                </Form.Item>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    style={{ marginBottom: 12 }}
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
  );
};
export default Carouseal;
