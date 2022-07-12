import React, { useState } from 'react';
import { Form, Popover, Button, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import FormList from './TieredPricingFormList';

const BulkEditing = (props) => {
  const { form, editKey = '' } = props;

  const [formTable] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(undefined); // 暂存数据

  const oldList = form.getFieldValue('skuInfoReqs');

  //   提交
  const hide = async () => {
    let newList = [];
    if (editKey == 'batchLadderObjects') {
      // 如果批量设置阶梯批采价时
      await formTable.validateFields().then((values) => {
        const { batchLadderObjects } = values;
        newList = oldList.map((item) => ({
          ...item,
          [editKey]: batchLadderObjects,
        }));
      });
    } else {
      newList = oldList.map((item) => ({
        ...item,
        [editKey]: data || undefined,
      }));
    }

    form.setFieldsValue({
      skuInfoReqs: newList,
    });
    formTable.setFieldsValue({
      batchLadderObjects: undefined,
    });
    setData(undefined);
    setVisible(false);
  };

  const contentDom = () => {
    return (
      <>
        {editKey === 'batchLadderObjects' ? (
          <Form form={formTable}>
            <FormList></FormList>
          </Form>
        ) : (
          <div>
            <InputNumber
              addonBefore="￥"
              // value={data}
              onChange={setData}
              style={{
                width: 150,
              }}
            ></InputNumber>
          </div>
        )}
        <div style={{ marginTop: 10, height: 25 }}>
          <Button size="small" style={{ float: 'right' }} type="primary" onClick={hide}>
            确定
          </Button>
        </div>
      </>
    );
  };

  const popoverProps = {
    title: '批量修改',
    content: contentDom,
    trigger: 'click',
    visible,
    destroyTooltipOnHide: true,
    onVisibleChange: (val) => setVisible(val),
  };
  return (
    <Popover {...popoverProps}>
      <Button type="link" icon={<EditOutlined />}></Button>
    </Popover>
  );
};

export default BulkEditing;
