import React, { useEffect } from 'react';
import { connect } from 'umi';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Select } from '@/components/FormCondition/formModule';

const SelectTag = ({ dispatch, goodsTag }) => {
  useEffect(() => {
    fetchGetData();
  }, []);

  const fetchGetData = () => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagList',
      payload: {
        tagType: 'show',
      },
    });
  };

  return (
    <>
      <Form.Item label="选择标签" required>
        <Input.Group compact>
          <Form.Item name={'showTag'} rules={[{ required: true, message: '请选择标签' }]}>
            <Select
              label="标签"
              disabled
              select={goodsTag.list}
              style={{ width: 200 }}
              fieldNames={{ value: 'configGoodsTagId', label: 'tagName' }}
            ></Select>
          </Form.Item>
          <Button icon={<CheckOutlined />} />
        </Input.Group>
      </Form.Item>
      <Form.Item label="标签商品类型" name={'contentGoodsType'} hidden required>
        <Input></Input>
      </Form.Item>
    </>
  );
};

export default connect(({ goodsTag }) => ({
  goodsTag,
}))(SelectTag);
