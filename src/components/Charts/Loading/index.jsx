import React from 'react';
import { Spin } from 'antd';

const ChartsLoading = ({ loading, children }) => {
  return loading ? (
    <Spin spinning={true}>
      <div style={{ height: 300 }}></div>
    </Spin>
  ) : (
    children
  );
};

export default ChartsLoading;
