/**
 * 操作按钮组件
 * @param {*} props 按钮配置参数
 */

import React from 'react';
import { Button, Popconfirm } from 'antd';

const HandleSetTable = (props) => {
  const { formItems } = props;

  const getFields = () => {
    const children = [];
    formItems.forEach((item, index) => {
      const { type = 'button', title = '按钮', visible = true } = item;
      let { pop = false } = item;

      let btnText = '';
      if (type === 'own') {
        btnText = title;
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
          <Button key={`del${type}${index}`} type="link" size="small" onClick={item.click}>
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
          key={`pop${type}${index}`}
        >
          <Button type="link" size="small">
            {btnText}
          </Button>
        </Popconfirm>
      ) : (
        component
      );
      children.push(visible && component);
    });
    return children;
  };

  return getFields();
};

export default HandleSetTable;
