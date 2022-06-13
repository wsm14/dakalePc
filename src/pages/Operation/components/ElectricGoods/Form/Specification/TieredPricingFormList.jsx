import React from 'react';
import { Form, InputNumber, Button } from 'antd';
import styles from './style.less';

const TieredPricingFormList = () => {
  const styleObj = {
    width: 100,
  };
  return (
    <Form.List name="batchLadderObjects" initialValue={[{}]}>
      {(fields, { add, remove, move }, { errors }) => {
        return (
          <div className={styles.tiered_pricing_box}>
            <div className={styles.tiered_table_head}>
              <div>操作</div>
              <div style={{ width: 150 }}>
                <span style={{ color: 'red' }}>*</span>购买数量
              </div>
              <div>
                <span style={{ color: 'red' }}>*</span>批采价
              </div>
              <div>
                <span style={{ color: 'red' }}>*</span>结算价
              </div>
            </div>
            {fields.map((field) => (
              <div key={field.key} style={{ display: 'flex' }}>
                <div className={styles.tiered_table_row_cell}>
                  <Button type="link" onClick={() => add()}>
                    +
                  </Button>
                  {field.name !== 0 && (
                    <Button type="link" onClick={() => remove(field.name)}>
                      -
                    </Button>
                  )}
                </div>
                <div className={styles.tiered_table_row_cell} style={{ width: 150 }}>
                  <Form.Item
                    rules={[{ required: true, message: '请输入数量' }]}
                    name={[field.name, 'miniNum']}
                    noStyle
                  >
                    <InputNumber precision={0} min={0} style={{ width: 70 }}></InputNumber>
                  </Form.Item>
                  个及以上
                </div>
                <div className={styles.tiered_table_row_cell}>
                  <Form.Item
                    rules={[{ required: true, message: '请输入批采价' }]}
                    name={[field.name, 'unitPrice']}
                    noStyle
                  >
                    <InputNumber
                      addonBefore="￥"
                      precision={2}
                      min={0}
                      style={styleObj}
                    ></InputNumber>
                  </Form.Item>
                </div>
                <div className={styles.tiered_table_row_cell}>
                  <Form.Item
                    rules={[{ required: true, message: '请输入结算价' }]}
                    name={[field.name, 'settlePrice']}
                    noStyle
                  >
                    <InputNumber
                      addonBefore="￥"
                      precision={2}
                      min={0}
                      style={styleObj}
                    ></InputNumber>
                  </Form.Item>
                </div>
              </div>
            ))}
            <Form.ErrorList errors={errors} />
          </div>
        );
      }}
    </Form.List>
  );
};

export default TieredPricingFormList;
