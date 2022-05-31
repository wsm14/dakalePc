import React from 'react';
import { Modal, Form, InputNumber, Button } from 'antd';
import styles from './style.less';

function TieredPricing(props) {
  const { visible, onClose } = props;

  const [formTable] = Form.useForm();

  const onFinish = () => {
    formTable.validateFields().then((values) => {
      console.log('values', values);
    });
  };

  const modalProps = {
    title: '批采阶梯价',
    width: 650,
    visible: visible,
    closable: false,
    onOk: onFinish,
    onCancel: onClose,
  };

  const styleObj = {
    width: 100,
  };

  return (
    <Modal {...modalProps}>
      <Form form={formTable} onFinish={onFinish}>
        <Form.List name="batchLadderObjects" initialValue={[{}]}>
          {(fields, { add, remove, move }, { errors }) => {
            return (
              <div className={styles.tiered_pricing_box}>
                <div className={styles.tiered_table_head}>
                  <div>操作</div>
                  <div>购买数量</div>
                  <div>批采价</div>
                  <div>结算价</div>
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
                    <div className={styles.tiered_table_row_cell}>
                      <Form.Item name={[field.name, 'miniNum']} noStyle>
                        <InputNumber precision={0} min={0} style={styleObj}></InputNumber>
                      </Form.Item>
                    </div>
                    <div className={styles.tiered_table_row_cell}>
                      <Form.Item name={[field.name, 'unitPrice']} noStyle>
                        <InputNumber
                          addonBefore="￥"
                          precision={2}
                          min={0}
                          style={styleObj}
                        ></InputNumber>
                      </Form.Item>
                    </div>
                    <div className={styles.tiered_table_row_cell}>
                      <Form.Item name={[field.name, 'settlePrice']} noStyle>
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

                {/* <Form.ErrorList errors={errors} /> */}
              </div>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default TieredPricing;
