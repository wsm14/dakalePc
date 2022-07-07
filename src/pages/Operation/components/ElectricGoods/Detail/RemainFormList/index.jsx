import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import styles from './style.less';

function RemainFormList(props) {
  const { form, detail = {} } = props;
  const { skuInfoReqs = [], customSize = [] } = detail;

  const styleObj = {
    width: 100,
  };

  return (
    <Form.List name="skuInfoReqs">
      {(fields, { add, remove, move }, { errors }) => {
        return (
          <div className={styles.tiered_pricing_box}>
            <div className={styles.tiered_table_head}>
              <div>SKU码</div>
              <div>{customSize.map((item) => item.name).join('/')}</div>
              <div>
                <span style={{ color: 'red' }}>*</span>商品库存
              </div>
            </div>
            {fields.map((field) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 5 }}>
                <div className={styles.tiered_table_row_cell}>
                  {skuInfoReqs[field.name]['skuCode']}
                </div>
                <div className={styles.tiered_table_row_cell}>
                  {skuInfoReqs[field.name]['skuAttributeResps'].map((item) => item.value).join('/')}
                </div>
                <div className={styles.tiered_table_row_cell}>
                  <Form.Item
                    name={[field.name, 'remain']}
                    rules={[{ required: true, message: '请输入商品库存' }]}
                    noStyle
                  >
                    <InputNumber precision={0} min={0} style={styleObj}></InputNumber>
                  </Form.Item>
                </div>
              </div>
            ))}

            {/* <Form.ErrorList errors={errors} /> */}
          </div>
        );
      }}
    </Form.List>
  );
}

export default RemainFormList;
