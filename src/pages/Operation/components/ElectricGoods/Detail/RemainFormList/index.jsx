import React from 'react';
import { Form } from 'antd';
import styles from './style.less';

function RemainFormList(props) {
  const { form, customSize = [] } = props;

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
              <div>商品库存</div>
            </div>
            {fields.map((field) => (
              <div key={field.key} style={{ display: 'flex' }}>
                <div className={styles.tiered_table_row_cell}>
                  <Form.Item name={[field.name, 'skuCode']} noStyle>
                    <Input style={styleObj} disabled={true}></Input>
                  </Form.Item>
                </div>
                <div className={styles.tiered_table_row_cell}>
                  {() => {
                    // 获取规格对象
                    const specificationType = form
                      .getFieldValue('skuInfoReqs')
                      [field.name]['attributes'].map((item) => item.value)
                      .join('/');
                    return specificationType;
                  }}
                </div>

                <div className={styles.tiered_table_row_cell}>
                  <Form.Item
                    name={[field.name, 'initStock']}
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
