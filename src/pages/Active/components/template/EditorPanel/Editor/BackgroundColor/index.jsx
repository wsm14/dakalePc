import React, { useState, useEffect } from 'react';
import { SketchPicker, CirclePicker } from 'react-color';

/**
 * 颜色选择器
 */
export default ({ cRef }) => {
  const [color, setColor] = useState('#ffffff');

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () =>
      new Promise((resolve) => {
        resolve(color);
      }),
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <SketchPicker color={color} onChangeComplete={(val) => setColor(val)} />
      <div style={{ marginTop: 20 }}>
        <CirclePicker color={color} onChangeComplete={(val) => setColor(val)}></CirclePicker>
      </div>
    </div>
  );
};
