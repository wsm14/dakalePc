import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import update from 'immutability-helper';
import FormList from './TieredPricingFormList';

function TieredPricing(props) {
  const { visible, onClose, form, specificationDisabled, name } = props;

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

  return (
    <Modal {...modalProps}>
      <Form form={formTable}>
        <FormList></FormList>
      </Form>
    </Modal>
  );
}

export default TieredPricing;
