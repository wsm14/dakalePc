import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button } from 'antd';
import GoodsItemSet from '../GoodsItemSet';

const GoodsGroupSet = () => {
  return (
    <div style={{ marginBottom: 24 }}>
      <Form.List name="groups" initialValue={[{}]}>
        {(fields, { add, remove }) => {
          return (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="from_before_tip" style={{ width: '25%', textAlign: 'right' }}>
                  套餐单品：
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                {fields.map((field, i) => (
                  <GoodsItemSet
                    key={field.key}
                    groupLength={fields.length}
                    groupName={field.name}
                    gooupKey={field.fieldKey}
                    handleRemove={() => remove(field.name)}
                  ></GoodsItemSet>
                ))}
                <Button
                  style={{ marginTop: 20 }}
                  disabled={fields.length === 15}
                  onClick={() => add()}
                  type="primary"
                >
                  <PlusOutlined /> {fields.length} / {15} 添加单品组
                </Button>
              </div>
            </>
          );
        }}
      </Form.List>
    </div>
  );
};

export default GoodsGroupSet;
