import React from 'react';
import { Checkbox, Spin } from 'antd';
import { delectProps } from '../utils';

const CheckboxBlock = (props) => {
  
  const { select, loading } = props;

  const divProps = delectProps(props);

  return loading ? <Spin /> : <Checkbox.Group options={select} {...divProps} />;
};

export default CheckboxBlock;
