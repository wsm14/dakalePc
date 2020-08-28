const SysAccountRoleSet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 新增修改角色 传id修改 不传id新增
  const fetchEdit = (payload) => {
    dispatch({
      type: 'sysAccountList/fetchAccountEdit',
      payload: { ...initialValues, ...payload },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '管理员设置',
    loadingModels: 'sysAccountList',
    initialValues,
    formItems: [
      {
        label: '姓名',
        name: 'truename',
      },
      {
        label: '登录帐号',
        name: 'username',
        maxLength: 20,
      },
      {
        label: '手机号',
        name: 'mobile',
      },
      {
        label: '状态',
        name: 'status',
        type: 'radio',
        select: ['禁用', '启用'],
      },
    ],
    onFinish: fetchEdit,
    ...props,
  };
};

export default SysAccountRoleSet;
