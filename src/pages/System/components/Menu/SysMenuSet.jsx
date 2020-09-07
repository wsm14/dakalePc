const SysMenuSet = (props) => {
  const { dispatch, allMenu, initialValues, handleCallback } = props;

  // 新增修改 传id修改 不传id新增
  const fetchMenuEdit = (payload) => {
    dispatch({
      type: 'sysMenuList/fetchMenuSet',
      payload: {
        ...initialValues,
        id: initialValues.accessId,
        ...payload,
        pid: payload.pid[payload.pid.length - 1],
      },
      callback: handleCallback,
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `菜单设置 - ${initialValues.menuName || initialValues.accessName || '新增'}`,
    loadingModels: 'sysMenuList',
    initialValues,
    formItems: [
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
        hidden: !!initialValues.type,
        select: [
          { name: '无', value: '0' },
          ...allMenu.map((item) => ({ name: item.accessName, value: item.authAccessId })),
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
        type: 'radio',
        visible: !!initialValues.type,
        select: [
          { name: '后台管理', value: 'admin' },
          { name: '商家管理', value: 'merchant' },
        ],
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
    ],
    onFinish: fetchMenuEdit,
    ...props,
  };
};

export default SysMenuSet;
