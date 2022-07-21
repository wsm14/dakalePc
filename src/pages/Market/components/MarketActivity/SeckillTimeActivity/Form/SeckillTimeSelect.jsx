import React from 'react';
import moment from 'moment';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, DatePicker, TimePicker } from 'antd';

const { RangePicker } = DatePicker;

// 限时秒杀时间选择
const SeckillTimeSelect = ({ keys = 'seckillTimeObjectList' }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <Form.List name={keys} initialValue={[{}]}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {/* <Form.Item label={'秒杀时间'} required>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            </Form.Item> */}
            {fields.map((field, name) => (
              <React.Fragment key={field.key}>
                <Form.Item required label={`秒杀时间`}>
                  <Input.Group size="small" compact>
                    <Form.Item
                      rules={[{ required: true, message: '请选择时间' }]}
                      name={[name, 'times']}
                      noStyle
                    >
                      <RangePicker style={{ width: '70%' }} />
                    </Form.Item>
                    <div style={{ marginTop: 10 }}>
                      每天{' '}
                      <TimePicker.RangePicker
                        disabled
                        defaultValue={[moment('10:00', 'HH:mm'), moment('12:00', 'HH:mm')]}
                      />
                    </div>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        style={{ fontSize: 20, marginLeft: 10, marginTop: 10, lineHeight: '32px' }}
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Input.Group>
                </Form.Item>
              </React.Fragment>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default SeckillTimeSelect;
