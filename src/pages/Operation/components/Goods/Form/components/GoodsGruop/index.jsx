import React from 'react';
import { Form, Input, InputNumber, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './style.less';
import DrawerCondition from '@/components/DrawerCondition';

// 表单排版
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 17 },
  },
};

const formList = ({ visible, onConfirm, pform, onClose }) => {
  const [form] = Form.useForm();

  const modalProps = {
    title: `添加子单品`,
    width: 500,
    visible,
    maskClosable: false,
    destroyOnClose: true,
    zIndex: 100000000,
    onClose,
    footer: (
      <Button
        onClick={() =>
          form.validateFields().then((values) => {
            const { packageGoodsObjects } = values;
            packageGoodsObjects.forEach((item) => (item.goodsPrice = item.goodsPrice.toFixed(2)));
            console.log(values);
            pform.setFieldsValue(values);
            onConfirm(values.packageGoodsObjects);
            onClose();
          })
        }
        type="primary"
      >
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Form {...formItemLayout} form={form} initialValues={{ packageGoodsObjects: [{}] }}>
        <Form.List name="packageGoodsObjects">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, i) => (
                  <div key={field.key} className={styles.goods_group_item}>
                    <div className={styles.goods_group_title}>
                      <div className={styles.goods_group_title_text}>子单品 {i + 1}</div>
                      {fields.length > 1 && (
                        <DeleteOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      )}
                    </div>
                    <Form.Item
                      label="单品名称"
                      name={[field.name, 'goodsName']}
                      fieldKey={[field.fieldKey, 'goodsName']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入单品名称" maxLength={30} />
                    </Form.Item>
                    <Form.Item
                      label="数量"
                      name={[field.name, 'goodsNum']}
                      fieldKey={[field.fieldKey, 'goodsNum']}
                      rules={[{ required: true }]}
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
                      label="价格"
                      name={[field.name, 'goodsPrice']}
                      fieldKey={[field.fieldKey, 'goodsPrice']}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入价格"
                        precision={2}
                        min={0}
                        max={999999.99}
                      />
                    </Form.Item>
                  </div>
                ))}
                <Space>
                <Button
                style={{marginLeft:"65px"}}
                  disabled={fields.length === 30}
                  onClick={() => {
                    add();
                  }}
                  type="primary"
                  className={styles.goods_group_btn}
                >
                  <PlusOutlined /> {fields.length} / {30} 添加
                </Button>
                </Space>
              </>
            );
          }}
        </Form.List>
      </Form>
    </DrawerCondition>
  );
};

export default formList;
