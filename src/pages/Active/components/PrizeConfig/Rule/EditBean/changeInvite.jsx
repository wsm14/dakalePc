import React, { useState } from 'react';
import { connect } from 'umi';
import { InputNumber } from 'antd';

function changeInvite(props) {
  const { numRef, timesRef, blindBoxRule } = props;

  return (
    <>
      助力获得免费次数：每邀请
      {
        <InputNumber
          ref={numRef}
          defaultValue={blindBoxRule?.num}
          placeholder={'请输入'}
        ></InputNumber>
      }
      个新用户助力获得
      {
        <InputNumber
          ref={timesRef}
          defaultValue={blindBoxRule?.times}
          placeholder={'请输入'}
        ></InputNumber>
      }
      次。
    </>
  );
}

export default connect()(changeInvite);
