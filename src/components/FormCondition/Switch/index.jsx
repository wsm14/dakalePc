import React from 'react';
import { Switch } from 'antd';

const SwitchBlock = (props) => {
  const switchProps = JSON.parse(JSON.stringify(props));
  delete switchProps.name;
  return <Switch {...switchProps} />;
};

export default SwitchBlock;
