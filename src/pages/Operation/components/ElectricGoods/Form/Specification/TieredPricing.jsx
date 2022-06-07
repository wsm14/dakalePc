import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button } from 'antd';
import update from 'immutability-helper';
import styles from './style.less';

function TieredPricing(props) {
  const { visible, onClose, form, setBatchOnOff, specificationDisabled, name } = props;

  const [formTable] = Form.useForm();

  useEffect(() => {
    if (visible) {
      // // 数据回显
      let newData = [{}];
      if (specificationDisabled) {
        newData = form.getFieldValue('skuInfoReqs')[name]?.batchLadderObjects;
      } else {
        newData = form.getFieldValue('batchLadderObjects');
      }

      formTable.setFieldsValue({ batchLadderObjects: newData });
    } else {
      formTable.setFieldsValue({ batchLadderObjects: [{}] });
    }
  }, [visible]);

  // 确定按钮
  const onFinish = () => {
    formTable.validateFields().then((values) => {
      const { batchLadderObjects } = values;

      if (specificationDisabled) {
        // 多规格
        const dataList = form.getFieldValue('skuInfoReqs');
        const newData = update(dataList, {
          $splice: [
            [
              name,
              1,
              {
                ...dataList[name],
                batchLadderObjects,
              },
            ],
          ],
        });
        form.setFieldsValue({
          skuInfoReqs: newData,
        });
      } else {
        // 单规格
        form.setFieldsValue({
          batchLadderObjects,
        });
      }
      setBatchOnOff(true);
      onClose();
    });
  };

  const modalProps = {
    title: '批采阶梯价',
    width: 650,
    visible: visible,
    closable: false,
    destroyOnClose: true,
    onOk: onFinish,
    onCancel: onClose,
  };

  const styleObj = {
    width: 100,
  };

  return (
    <Modal {...modalProps}>
      <Form form={formTable}>
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
                      <Form.Item
                        rules={[{ required: true, message: '请输入数量' }]}
                        name={[field.name, 'miniNum']}
                        noStyle
                      >
                        <InputNumber precision={0} min={0} style={styleObj}></InputNumber>
                      </Form.Item>
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
