import React, { useState } from 'react';
import { connect } from 'umi';
import { InputNumber } from 'antd';

function changeInvite(props) {
  // const { onChange1, onChange2, num, times } = props;
  const { numRef, timesRef } = props;

  return (
    <>
      助力获得免费次数：每邀请
      {
        <InputNumber
          // value={num}
          ref={numRef}
          // onChange={onChange1}
          placeholder={'请输入'}
        ></InputNumber>
      }
      个新用户助力获得
      {
        <InputNumber
          // value={times}
          ref={timesRef}
          // onChange={onChange2}
          placeholder={'请输入'}
        ></InputNumber>
      }
      次。
    </>
  );
}

export default connect()(changeInvite);
