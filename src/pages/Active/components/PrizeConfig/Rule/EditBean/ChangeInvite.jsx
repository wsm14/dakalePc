import React from 'react';
import { connect } from 'umi';
import { InputNumber, Form } from 'antd';

const FormItem = Form.Item;

function changeInvite() {
  const spanStyle = {
    display: 'inline-block',
    lineHeight: '32px',
    textAlign: 'center',
    margin: '0 5px',
  };

  return (
    <FormItem label="助力获得免费次数">
      <span style={spanStyle}>每邀请</span>
      <FormItem name={'num'} style={{ display: 'inline-flex' }}>
        <InputNumber
          placeholder={'请输入'}
          min={0}
          precision={0}
          style={{ display: 'inline-block', width: '100px' }}
        ></InputNumber>
      </FormItem>
      <span style={spanStyle}>个新用户助力获得</span>
      <FormItem name={'times'} style={{ display: 'inline-flex' }}>
        <InputNumber
          placeholder={'请输入'}
          min={0}
          precision={0}
          style={{ display: 'inline-block', width: '100px' }}
        ></InputNumber>
      </FormItem>
      <span style={spanStyle}>次。</span>
    </FormItem>
  );
}

export default connect()(changeInvite);
