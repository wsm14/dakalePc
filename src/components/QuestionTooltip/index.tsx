import React from 'react';
import { Tooltip } from 'antd';

import { EyeOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const QuestionTooltip = (props: any) => {
  const {
    title = '',
    content = '',
    type = 'info',
    overlayStyle,
    iconStyle,
    placement = 'top',
  } = props;

  const icon = {
    info: <ExclamationCircleOutlined style={iconStyle} />,
    quest: <QuestionCircleOutlined style={iconStyle} />,
    eye: <EyeOutlined style={iconStyle} />,
  }[type];

  return (
    <>
      {title}&nbsp;
      <Tooltip title={content} overlayStyle={overlayStyle} placement={placement}>
        {icon}
      </Tooltip>
    </>
  );
};

export default QuestionTooltip;
