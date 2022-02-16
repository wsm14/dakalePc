import React from 'react';
import { Button, Badge } from 'antd-mobile';
import AuthConsumer from '@/layouts/AuthConsumer';

/**
 * 额外按钮
 * @param {Array} list 按钮list
 * @param {Object} list { auth show text onClick className style }
 * @returns
 */
const ExtraButton = ({ list = [], children }) => {
  const btnSwitch = ({
    text = '新增',
    auth = true,
    show,
    disabled,
    className = 'dkl_green_btn',
    onClick,
    count = 0, // 计数
    style = {},
    loading,
  }) => {
    <AuthConsumer auth={auth} show={show} key={auth}>
      <Badge text={count}>
        <Button
          className={className}
          disabled={disabled}
          onClick={onClick}
          style={style}
          loading={loading}
        >
          {text}
        </Button>
      </Badge>
    </AuthConsumer>;
  };

  return (
    <>
      {list.map((item) => btnSwitch(item))}
      {children}
    </>
  );
};

export default ExtraButton;
