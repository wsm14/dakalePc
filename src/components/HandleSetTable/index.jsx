/**
 * 操作按钮组件
 * @param {*} props 按钮配置参数
 */

import React from 'react';
import { Button, Popconfirm } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import { ROLE_BUTTON_TYPE } from '@/common/roleConstant';

const HandleSetTable = (props) => {
  const { formItems } = props;

  const getFields = () => {
    const children = [];
    formItems.forEach((item, index) => {
      const { type = 'button', title = '按钮', visible = true } = item;
      let { pop = false, auth = false } = item;
      auth = auth || type;

      let btnText = ROLE_BUTTON_TYPE[type];
      if (type === 'own') {
        btnText = title;
        // 默认全显示 配置权限则根据权限显示
        auth = auth === 'own' ? true : auth;
      }
      if (type === 'del') {
        pop = true;
      }
      if (type === 'send') {
        pop = true;
      }
      if (type === 'up') {
        pop = true;
      }
      if (type === 'down') {
        pop = true;
      }

      let component =
        type === 'text' ? (
          { title }
        ) : (
          <Button type="link" size="small" onClick={item.click}>
            {btnText}
          </Button>
        );
      component = pop ? (
        <Popconfirm
          placement="top"
          title={item.popText || `确认${btnText}？`}
          onConfirm={item.click}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" size="small">
            {btnText}
          </Button>
        </Popconfirm>
      ) : (
        component
      );
      children.push(
        visible && (
          <AuthConsumer key={`auth${type}${index}`} auth={auth}>
            {component}
          </AuthConsumer>
        ),
      );
    });
    return children;
  };

  return getFields();
};

export default HandleSetTable;
