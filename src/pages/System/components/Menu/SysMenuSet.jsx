const SysMenuSet = (props) => {
  const { dispatch, childRef, initialValues } = props;

  // 新增修改 传id修改 不传id新增
  const fetchMenuEdit = (payload) => {
    dispatch({
      type: 'sysMenuList/fetchMenuSet',
      payload: { ...initialValues, id: initialValues.accessId, ...payload },
      callback: () => {
        childRef.current.fetchGetData();
        fetchGetAuthMenuTree();
      },
    });
  };

  // 获取权限树
  const fetchGetAuthMenuTree = () => {
    dispatch({
      type: 'userInfo/fetchGetAuthMenuTree',
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '菜单设置',
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
        label: '父节点ID',
        name: 'pid',
      },
      {
        label: '权重',
        visible: initialValues.id,
        name: 'weight',
      },
      {
        label: '资源类别',
        name: 'ownerType',
        type: 'radio',
        visible: !initialValues.id,
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
