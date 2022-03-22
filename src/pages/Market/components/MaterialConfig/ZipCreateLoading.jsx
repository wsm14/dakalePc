import React from 'react';
import { Progress } from 'antd';

const ZipCreateLoading = ({ show = false, percent = 0, text }) => {
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
        flexDirection: 'column',
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
      <div style={{ marginTop: 10, color: '#ffffff', fontSize: 16 }}>{text}</div>
    </div>
  ) : null;
};

export default ZipCreateLoading;
