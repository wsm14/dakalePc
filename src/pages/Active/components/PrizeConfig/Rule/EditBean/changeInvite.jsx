import React, { useState } from 'react';
import { connect } from 'umi';
import { InputNumber } from 'antd';

function changeInvite() {
  const [num, setNum] = useState(0);
  const [times, setTimes] = useState(0);

  const onChange1 = (num) => {
    setNum(num);
    console.log(num, 'num');
  };
  const onChange2 = (times) => {
    setTimes(times);
    console.log(times, 'times');
  };
  return (
    <>
      助力获得免费次数：每邀请
      {<InputNumber value={num} onChange={onChange1} placeholder={'请输入'}></InputNumber>}{' '}
      个新用户助力获得
      {<InputNumber value={times} onChange={onChange2} placeholder={'请输入'}></InputNumber>} 次。
    </>
  );
}

export default connect()(changeInvite);
