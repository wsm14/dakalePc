import React from 'react';
import { Button, Space, Badge } from 'antd';
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
    text = '新增',
    auth = true,
    show,
    disabled,
    className = 'dkl_green_btn',
    onClick,
    count = 0, // 计数
    style = {},
    loading,
    type, // excel
    dispatch, // excel
    data, // excel
    exportProps, // excel
    typeBtn,
  }) => {
    switch (type) {
      case 'excel':
        return (
          <ExcelButton
            dispatchType={dispatch}
            dispatchData={data}
            key={auth}
            exportProps={exportProps}
          ></ExcelButton>
        );
      default:
        return (
          <AuthConsumer auth={auth} show={show} key={auth}>
            <Badge count={count}>
              <Button
                type={typeBtn}
                className={className}
                disabled={disabled}
                onClick={onClick}
                style={style}
                loading={loading}
              >
                {text}
              </Button>
            </Badge>
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
