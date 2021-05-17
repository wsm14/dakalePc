import React from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../index.less';
import { format } from 'prettier';

const RegularForm = (props) => {
  const { handleChangesFn } = props;

  const handleChanges = (val,index) => {
    handleChangesFn(val,index);
  };

  return (
    <Form.List name="handlingFeeList">
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ fieldKey, name, key, ...restField }, index) => (
            <Form.Item key={fieldKey + name} style={{marginBottom:0}}>
              <div className={styles.flexCon} style={{flexWrap:'wrap'}}>
                <Form.Item
                  {...restField}
                  name={[name, 'minMoney']}
                  hidden={index == 0 ? true : false}
                  rules={[{ required: false}]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputNumber
                    disabled={index == 1 ? true : false}
                    onChange={() => handleChanges('minMoney',index)}
                    style={{ width: 120 }}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'maxMoney']}
                  hidden={index == 1 ? true : false}
                  rules={index == 0 ?[{ required: true, message: '请输入金额' }]:[{ required: false}]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputNumber
                   min={0}
                    // disabled={index == 1 ? true : false}
                    onChange={() => handleChanges('maxMoney',index)}
                    style={{ width: 120 }}
                  />
                </Form.Item>
                {fieldKey == 0 ? (
                  <span className={styles.spanAfter} style={{ marginRight: 10 }}>
                    元以下
                  </span>
                ) : (
                  <span className={styles.spanAfter} style={{ marginRight: 10 }}>
                    元以上
                  </span>
                )}
                <span className={styles.spanAfter} style={{ marginRight: 10 }}>
                  提现手续费:
                </span>
                <Form.Item
                  {...restField}
                  name={[name, 'handlingFee']}
                  rules={[{ required: true, message: '请输入手续费' }]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputNumber  min={0}  onChange={(val) => handleChanges(val)} style={{ width: 120 }} />
                </Form.Item>
                <span className={styles.spanAfter}>元</span>
              </div>
              {/* <div className={styles.flexCon}>
                <Form.Item {...restField} name={[name, 'minMoney']}>
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
                  name={[name, 'handlingFee']}
                  rules={[{ required: true, message: '请输入手续费' }]}
                >
                  <InputNumber style={{ width: 120 }} />
                </Form.Item>
                <span className={styles.spanAfter}>元</span>
              </div> */}
            </Form.Item>
          ))}
        </>
      )}
    </Form.List>
  );
};
export default RegularForm;
