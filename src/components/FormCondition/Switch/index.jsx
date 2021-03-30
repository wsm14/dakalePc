import React from 'react';
import { Switch } from 'antd';
import { delectProps } from '../utils';

const SwitchBlock = (props) => {
  const switchProps = delectProps(props);
  
  return <Switch {...switchProps} />;
};

export default SwitchBlock;
