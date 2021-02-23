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
      const {
        type = 'button',
        title,
        visible = true,
        pop = false,
        auth = false,
        click,
        popText,
      } = item;

      // 默认pop确认弹窗
      const popType = ['del', 'send', 'up', 'down'];
      const popShow = pop || popType.includes(type);

      // 显示名称
      const btnText = title || ROLE_BUTTON_TYPE[type] || '按钮';

      // 按钮为text 的情况下只显示文字
      const btnBlock =
        type === 'text' ? (
          btnText
        ) : (
          <Button type="link" size="small" onClick={click}>
            {btnText}
          </Button>
        );

      children.push(
        <AuthConsumer show={visible} key={`auth${type}${index}`} auth={auth || type}>
          {/* 是否需要显示pop */}
          {popShow ? (
            <Popconfirm
              placement="top"
              title={
                popText ? (
                  <div style={{ whiteSpace: 'pre-line' }}>{popText}</div>
                ) : (
                  `确认${btnText}？`
                )
              }
              onConfirm={click}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" size="small">
                {btnText}
              </Button>
            </Popconfirm>
          ) : (
            btnBlock
          )}
        </AuthConsumer>,
      );
    });
    return children;
  };

  return getFields();
};

export default HandleSetTable;
