import React from 'react';
import { Form, Input, Radio, Upload, Space, Select } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UpSquareOutlined,
  DownSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const formList = (props) => {
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
              <Form.Item name={[field.name, 'linkType']} fieldKey={[field.fieldKey, 'linkType']}>
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
                    <Form.Item name={[field.name, 'path']} fieldKey={[field.fieldKey, 'path']}>
                      <Input
                        placeholder="输入合法链接"
                        addonAfter={
                          <SearchOutlined
                            onClick={() =>
                              setVisibleSearch({
                                visible: true,
                                key: field.name,
                                name: 'path',
                                type: 'url',
                              })
                            }
                          />
                        }
                      />
                    </Form.Item>
                  ),
                  native: (
                    <Form.Item name={[field.name, 'path']} fieldKey={[field.fieldKey, 'path']}>
                      <Select
                        showSearch
                        defaultActiveFirstOption={false}
                        optionFilterProp="children"
                        placeholder="请选择"
                        style={{ width: '100%' }}
                        onChange={(value) => {
                          if (value === 'goMerchantBox')
                            setVisibleSearch({
                              visible: true,
                              key: field.name,
                              name: 'param',
                              type: 'merchant',
                            });
                        }}
                      ></Select>
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
      {fields.length > 1 && (
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

export default formList;
