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
    danger = false,
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
            disabled={disabled}
            key={auth}
            exportProps={exportProps}
          ></ExcelButton>
        );
      default:
        return (
          <AuthConsumer auth={auth} show={show} key={`${auth}${text}`}>
            <Badge count={count}>
              <Button
                type={typeBtn}
                danger={danger}
                className={typeBtn || danger ? '' : className}
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

  if (!list.length) return null;

  return (
    <Space>
      {list.map((item) => btnSwitch(item))}
      {children}
    </Space>
  );
};

export default ExtraButton;
