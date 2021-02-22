import React from 'react';
import { Spin } from 'antd';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default () => (
  <div style={{ padding: '100px 0', textAlign: 'center' }}>
    <Spin size="large" />
  </div>
);
