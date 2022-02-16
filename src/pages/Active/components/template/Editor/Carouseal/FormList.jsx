import React from 'react';
import { Form, Upload, Space } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UpSquareOutlined,
  DownSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Radio, Input, Select } from '@/components/FormCondition/formModule';
import { NATIVE_PATH_TYPE } from '../nativePath';
import styles from './index.less';

// Banner跳转类型
export const BANNER_JUMP_TYPE = { '': '无', H5: 'H5', inside: '原生页面' };

const FormList = (props) => {
  const {
    form,
    fields,
    field,
    fileLists,
    remove,
    move,
    handleUpProps,
    handlePreview,
    setVisibleSearch,
  } = props;

  return (
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
        name={[field.name, 'img']}
        fieldKey={[field.fieldKey, 'img']}
        rules={[{ required: true, message: '请上传图片' }]}
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
          const linkType = getFieldValue('list')[field.name];
          return (
            <div>
              <Form.Item name={[field.name, 'linkType']} fieldKey={[field.fieldKey, 'linkType']}>
                <Radio
                  select={BANNER_JUMP_TYPE}
                  onChange={() => {
                    const saveData = form.getFieldValue('list')[field.name];
                    if (!saveData) form.getFieldValue('list')[field.name] = {};
                    form.getFieldValue('list')[field.name].path = undefined;
                  }}
                ></Radio>
              </Form.Item>
              {linkType &&
                {
                  '': null,
                  H5: (
                    <Form.Item name={[field.name, 'url']} fieldKey={[field.fieldKey, 'path']}>
                      <Input placeholder="输入合法链接" />
                    </Form.Item>
                  ),
                  inside: (
                    <Form.Item name={[field.name, 'path']} fieldKey={[field.fieldKey, 'path']}>
                      <Select select={NATIVE_PATH_TYPE} placeholder="请选择"></Select>
                    </Form.Item>
                  ),
                }[linkType.linkType]}
              {linkType && linkType.path === 'goMerchantBox' ? (
                <Form.Item
                  name={[field.name, 'data']}
                  rules={[{ required: true }]}
                  fieldKey={[field.fieldKey, 'data']}
                  style={{ marginTop: 5 }}
                >
                  <Input
                    placeholder="数据"
                    disabled
                    addonAfter={
                      <SearchOutlined
                        onClick={() => {
                          setVisibleSearch({
                            visible: true,
                            key: field.name,
                            name: 'param',
                            type: 'merchant',
                          });
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
      {fields.length > 2 && (
        <MinusCircleOutlined
          style={{ marginBottom: 12 }}
          onClick={() => {
            remove(field.name);
          }}
        />
      )}
    </Space>
  );
};

export default FormList;
