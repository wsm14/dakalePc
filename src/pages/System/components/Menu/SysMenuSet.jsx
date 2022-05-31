import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SysMenuSet = (props) => {
  const { dispatch, visible = {}, onClose, handleCallback, allMenu = [], loading } = props;

  const { show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  // 新增修改 传id修改 不传id新增
  const fetchMenuEdit = () => {
    form.validateFields().then((values) => {
      const { accessId } = detail;
      const payload = { ...detail, ...values, id: accessId };
      dispatch({
        type: 'sysMenuList/fetchMenuSet',
        payload,
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
    },
    {
      label: '父节点',
      name: 'pid',
      type: 'select',
      hidden: !!detail.type,
      select: [
        { name: '无', value: '0' },
        ...allMenu
          .filter((item) => item.authAccessId !== detail.accessId)
          .map((item) => ({ name: item.accessName, value: item.authAccessId })),
      ],
    },
    {
      label: '权重',
      visible: detail.id,
      name: 'weight',
    },
    {
      label: '资源类别',
      name: 'ownerType',
      hidden: true,
      visible: !!detail.type,
    },
    {
      label: '是否自动赋权',
      name: 'authType',
      visible: !detail.id,
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
    title: `菜单设置 - ${detail.menuName || detail.accessName || '新增'}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" loading={loading} onClick={fetchMenuEdit}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  allMenu: sysMenuList.allMenu,
  loading: loading.effects['sysMenuList/fetchMenuSet'],
}))(SysMenuSet);
