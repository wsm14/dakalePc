const SysRoleInfoSet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 新增修改角色 传id修改 不传id新增
  const fetchRoleEdit = (payload) => {
    dispatch({
      type: 'sysRoleList/fetchRoleEdit',
      payload: { id: initialValues.idString, ...initialValues, ...payload },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '角色设置',
    loadingModels: 'sysRoleList',
    initialValues,
    formItems: [
      {
        label: '角色名称',
        name: 'roleName',
        maxLength: 10,
      },
      {
        label: '备注',
        type: 'textArea',
        name: 'remark',
        maxLength: 10,
        rules: [{ required: false }],
      },
      {
        label: '角色类型',
        name: 'roleType',
        type: 'radio',
        visible: !initialValues.idString,
        select: [
          { name: '经理', value: 'manager' },
          { name: '普通员工', value: 'common' },
        ],
      },
      {
        label: '状态',
        name: 'status',
        type: 'radio',
        select: ['禁用', '启用'],
      },
    ],
    onFinish: fetchRoleEdit,
    ...props,
  };
};

export default SysRoleInfoSet;
