import React, { useState, useEffect, useImperativeHandle } from 'react';
import { SketchPicker, CirclePicker } from 'react-color';

/**
 * 颜色选择器
 */
export default ({ cRef, value }) => {
  const [color, setColor] = useState('#eeeeee');

  useEffect(() => {
    if (value.backgroundColor) setColor(value.backgroundColor);
  }, []);

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () =>
      new Promise((resolve) => {
        resolve({
          type: 'backgroundColor',
          dom: false,
          data: { backgroundColor: typeof color === 'string' ? color : color.hex },
        });
      }),
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <SketchPicker disableAlpha color={color} onChangeComplete={(val) => setColor(val)} />
      <div style={{ marginTop: 20 }}>
        <CirclePicker color={color} onChangeComplete={(val) => setColor(val)} />
      </div>
    </div>
  );
};
