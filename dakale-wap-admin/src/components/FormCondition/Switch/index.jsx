import React from 'react';
import { Switch } from 'antd';
import { delectProps } from '../utils';

const SwitchBlock = (props) => {
  const { loading } = props;
  const switchProps = delectProps(props);

  return <Switch {...switchProps} loading={loading} />;
};

export default SwitchBlock;
