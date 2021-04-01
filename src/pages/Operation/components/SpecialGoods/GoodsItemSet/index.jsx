import React from 'react';
import { Form, Input, InputNumber, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';

const formList = ({ groupName, gooupKey, groupLength, handleRemove }) => {
  return (
    <div className={styles.groupGoods}>
      <Form.Item
        label="单品组名称"
        name={[groupName, 'goosdsName']}
        fieldKey={[gooupKey, 'gooddsName']}
        rules={[{ required: true, message: '请输入单品组名称' }]}
      >
        <Input placeholder="请输入单品组名称" maxLength={30} />
      </Form.Item>
      <Form.List name={[groupName, 'groupGoods']} initialValue={[{}]}>
        {(fields, { add, remove }) => {
          return (
            <>
              <div
                className={`${styles.groupGoods_heard} ${fields.length > 1 && styles.otherItem}`}
              >
                <div>单品名称</div>
                <div>份数</div>
                <div>价格</div>
              </div>
              {fields.map((field, i) => (
                <div key={field.key} className={styles.goodsGroupBox}>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                      className={styles.del_icon}
                    />
                  )}
                  <Input.Group compact className={styles.group_item}>
                    <Form.Item
                      name={[field.name, 'goodsName']}
                      fieldKey={[field.fieldKey, 'goodsName']}
                      wrapperCol={{ span: 24 }}
                      rules={[{ required: true, message: '请输入单品名称' }]}
                    >
                      <Input placeholder="请输入单品名称" maxLength={30} />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'goodsNum']}
                      fieldKey={[field.fieldKey, 'goodsNum']}
                      rules={[{ required: true, message: '请输入数量' }]}
                      wrapperCol={{ span: 24 }}
                    >
                      <InputNumber
                        placeholder="请输入数量"
                        style={{ width: '100%' }}
                        precision={0}
                        min={0}
                        max={999999}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'goodsPrice']}
                      fieldKey={[field.fieldKey, 'goodsPrice']}
                      wrapperCol={{ span: 24 }}
                      rules={[{ required: true, message: '请输入价格' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入价格"
                        precision={2}
                        min={0}
                        max={999999.99}
                      />
                    </Form.Item>
                  </Input.Group>
                </div>
              ))}
              <div style={{ textAlign: 'right', marginTop: 20 }}>
                <Space>
                  {groupLength > 1 && (
                    <Button onClick={handleRemove} type="primary" danger>
                      删除该组
                    </Button>
                  )}
                  <Button disabled={fields.length === 20} onClick={() => add()} type="primary">
                    <PlusOutlined /> {fields.length} / {20} 添加
                  </Button>
                </Space>
              </div>
            </>
          );
        }}
      </Form.List>
    </div>
  );
};

export default formList;
