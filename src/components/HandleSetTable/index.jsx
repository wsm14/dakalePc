/**
 * 操作按钮组件
 * @param {*} props 按钮配置参数
 * type 默认类型:
 * {
 *    无   仅icon和浮动提示文案      配置：onClick事件 style className visible icon title
 *    icon 仅只有按钮不显示浮动文案  配置：onClick事件 style className visible icon
 *    pop  自定义pop内容弹出形式    配置：onClick事件 style className visible icon title content
 *    true 确认仅pop确认           配置：onClick事件 style className visible title okText cancelText
 *    eye  查看按钮                配置：onClick事件 style className visible title
 *    edit 修改                   配置：onClick事件 style className visible
 *    del  删除                   配置：onClick事件 style className visible okText cancelText
 * }
 * onConfirm为自定义Popconfirm确认 配置：onConfirm事件 content style className visible icon title okText cancelText
 *-------------------------------------------------
 * icon 按钮图标
 * title 标题名称
 * style icon样式
 * className icon className
 * content 弹出内容
 * onClick icon点击事件 同时配置type和click confirm 以type为准
 * onConfirm Popover确认事件
 * visible 是否显示
 * okText Popover确认按钮文案 默认确认
 * cancelText Popover取消按钮文案 默认取消
 */

import React from 'react';
import { Button } from 'antd';

const HandleSetTable = (props) => {

  const { formItems } = props;

  const getFields = () => {
    const children = [];
    formItems.forEach((item, index) => {
      const { type, title = '按钮', visible = true } = item;

      let btnText = '';
      if (type === 'own') {
        btnText = title;
      }
      if (type === 'info') {
        btnText = '详情';
      }
      if (type === 'eye') {
        btnText = '查看';
      }
      if (type === 'edit') {
        btnText = '编辑';
      }
      if (type === 'del') {
        btnText = '删除';
      }
      if (type === 'check') {
        btnText = '审核';
      }

      const component =
        type === 'text' ? (
          { title }
        ) : (
          <Button key={`del${type}${index}`} type="link" size="small" onClick={item.click}>
            {btnText}
          </Button>
        );
      children.push(visible && component);
    });
    return children;
  };

  return getFields();
};

export default HandleSetTable;
