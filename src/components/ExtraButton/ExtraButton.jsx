import React from 'react';
import { Button, Space } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import ExcelButton from './ExcelButton';

/**
 * 额外按钮
 * @param {Array} list 按钮list
 * @param {Object} list { auth show text onClick className style }
 * @returns
 */
const ExtraButton = ({ list = [], children }) => {
  const btnSwitch = ({
    auth,
    show,
    disabled,
    className = 'dkl_green_btn',
    onClick,
    style = {},
    text = '新增',
    type,
    dispatch,
    data,
    exportProps,
  }) => {
    switch (type) {
      case 'excel':
        return (
          <ExcelButton
            dispatchType={dispatch}
            dispatchData={data}
            exportProps={exportProps}
          ></ExcelButton>
        );
      default:
        return (
          <AuthConsumer auth={auth} show={show}>
            <Button className={className} disabled={disabled} onClick={onClick} style={style}>
              {text}
            </Button>
          </AuthConsumer>
        );
    }
  };

  return (
    <Space>
      {list.map((item) => btnSwitch(item))}
      {children}
    </Space>
  );
};

export default ExtraButton;
