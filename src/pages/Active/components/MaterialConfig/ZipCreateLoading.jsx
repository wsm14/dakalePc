import React from 'react';
import { Progress } from 'antd';

const ZipCreateLoading = ({ show = false, percent = 0 }) => {
  return show ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '100%',
        right: 0,
        backgroundColor: ' #ffffff61',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Progress
        type="circle"
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        percent={percent}
      />
    </div>
  ) : null;
};

export default ZipCreateLoading;
