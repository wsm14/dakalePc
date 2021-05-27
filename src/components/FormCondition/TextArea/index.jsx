import React from 'react';
import { Input } from 'antd';
import { delectProps } from '../utils';

const TextAreaBlock = (props) => {
  const { rows, maxLength, onChange } = props;

  const divProps = delectProps(props);

  return (
    <Input.TextArea
      {...divProps}
      showCount={maxLength ? true : false}
      rows={rows || 5}
      onChange={(e) => {
        onChange && onChange(e);
      }}
    />
  );
};

export default TextAreaBlock;
