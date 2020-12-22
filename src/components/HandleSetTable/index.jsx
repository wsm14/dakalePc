/**
 * 操作按钮组件
 * @param {*} props 按钮配置参数
 */

import React from 'react';
import { Button, Popconfirm } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';

const HandleSetTable = (props) => {
  const { formItems } = props;

  const getFields = () => {
    const children = [];
    formItems.forEach((item, index) => {
      const { type = 'button', title = '按钮', visible = true } = item;
      let { pop = false, auth = false } = item;
      auth = auth || type;

      let btnText = '';
      if (type === 'own') {
        btnText = title;
        // 默认全显示 配置权限则根据权限显示
        auth = auth === 'own' ? true : auth;
      }
      if (type === 'info') {
        btnText = '详情';
      }
      if (type === 'set') {
        btnText = '设置';
      }
      if (type === 'eye') {
        btnText = '查看';
      }
      if (type === 'edit') {
        btnText = '编辑';
      }
      if (type === 'del') {
        pop = true;
        btnText = '删除';
      }
      if (type === 'check') {
        btnText = '审核';
      }
      if (type === 'send') {
        pop = true;
        btnText = '发布';
      }
      if (type === 'up') {
        pop = true;
        btnText = '上架';
      }
      if (type === 'down') {
        pop = true;
        btnText = '下架';
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
