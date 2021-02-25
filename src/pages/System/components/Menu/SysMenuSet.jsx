import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SysMenuSet = (props) => {
  const { dispatch, visible = {}, onClose, handleCallback } = props;

  const { show = false, initialValues = {}, allMenu = [] } = visible;

  const [form] = Form.useForm();

  // 新增修改 传id修改 不传id新增
  const fetchMenuEdit = (payload) => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'sysMenuList/fetchMenuSet',
        payload: {
          ...initialValues,
          ...values,
          id: initialValues.accessId,
          ...payload,
        },
        callback: () => {
          onClose();
          handleCallback();
        },
      });
    });
  };

  const formItems = [
    {
      label: '菜单名称',
      name: 'accessName',
      maxLength: 10,
    },
    {
      label: '图标名称',
      rules: 'false',
      name: 'accessIcon',
    },
    {
      label: '菜单路径',
      name: 'accessUrl',
      rules: 'false',
      extra: '父级节点不需要输入',
    },
    {
      label: '父节点',
      name: 'pid',
      type: 'select',
      hidden: !!initialValues.type,
      select: [
        { name: '无', value: '0' },
        ...allMenu
          .filter((item) => item.authAccessId !== initialValues.accessId)
          .map((item) => ({ name: item.accessName, value: item.authAccessId })),
      ],
    },
    {
      label: '权重',
      visible: initialValues.id,
      name: 'weight',
    },
    {
      label: '资源类别',
      name: 'ownerType',
      hidden: true,
      visible: !!initialValues.type,
    },
    {
      label: '是否自动赋权',
      name: 'authType',
      visible: !initialValues.id,
      type: 'radio',
      select: ['不赋权', '赋予经理', '赋予所有人'],
    },
    {
      label: '状态',
      name: 'status',
      type: 'radio',
      select: ['禁用', '启用'],
    },
  ];

  const modalProps = {
    title: `菜单设置 - ${initialValues.menuName || initialValues.accessName || '新增'}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchMenuEdit()}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  sysMenuList,
  loading,
}))(SysMenuSet);
