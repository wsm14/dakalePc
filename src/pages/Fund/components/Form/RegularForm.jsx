import React from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../index.less';
import { format } from 'prettier';

const RegularForm = (props) => {
  const { handleChangesFn } = props;

  const handleChanges = (val) => {
    handleChangesFn(val);
  };

  return (
    <Form.List name="handlingFeeList">
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ fieldKey, name, key, index, ...restField }) => (
            <Form.Item key={fieldKey + name}>
              <div className={styles.flexCon}>
                <Form.Item
                  {...restField}
                  name={[name, 'maxMoney']}
                  rules={[{ required: true, message: '请输入金额' }]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputNumber
                    onChange={(val) => handleChanges(val)}
                    style={{ width: 120 }}
                  />
                </Form.Item>
                <span className={styles.spanAfter} style={{ marginRight: 10 }}>
                  元以下
                </span>
                <span className={styles.spanAfter} style={{ marginRight: 10 }}>
                  提现手续费:
                </span>
                <Form.Item
                  {...restField}
                  name={[name, 'handlingFee']}
                  rules={[{ required: true, message: '请输入手续费' }]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputNumber
                    onChange={(val) => handleChanges(val)}
                    style={{ width: 120 }}
                  />
                </Form.Item>
                <span className={styles.spanAfter}>元</span>
              </div>
              <div className={styles.flexCon}>
                <Form.Item {...restField} name={[name, 'maxMoney']}>
                  <InputNumber disabled />
                </Form.Item>
                <span className={styles.spanAfter} style={{ marginRight: 10 }}>
                  元以上
                </span>
                <span className={styles.spanAfter} style={{ marginRight: 10 }}>
                  提现手续费:
                </span>
                <Form.Item
                  {...restField}
                  name={[name, 'handlingFee2']}
                  rules={[{ required: true, message: '请输入手续费' }]}
                >
                  <InputNumber style={{ width: 120 }} />
                </Form.Item>
                <span className={styles.spanAfter}>元</span>
              </div>
            </Form.Item>
          ))}
        </>
      )}
    </Form.List>
  );
};
export default RegularForm;
