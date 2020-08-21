import React from 'react';
import { Tooltip } from 'antd';

import { EyeOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const QuestionTooltip = (props: any) => {
  const { title = '', content = '', type = 'info', overlayStyle, placement = 'top' } = props;

  const icon = {
    info: <ExclamationCircleOutlined />,
    quest: <QuestionCircleOutlined />,
    eye: <EyeOutlined />,
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
