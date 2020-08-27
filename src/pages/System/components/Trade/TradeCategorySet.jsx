const TradeCategorySet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 提交表单
  const fetchDataEdit = (payload) => {
    const editType = !Object.keys(initialValues).length;
    dispatch({
      type: { true: 'sysTradeList/fetchTradeAdd', false: 'sysTradeList/fetchTradeEdit' }[editType],
      payload: { ...initialValues, ...payload },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '新增编辑',
    loadingModels: 'sysTradeList',
    initialValues,
    formItems: [
      {
        label: '一级类目',
        name: 'roleName',
        disabled: true,
        maxLength: 20,
      },
      {
        label: '二级类目',
        disabled: true,
        name: 'remasrk',
        maxLength: 20,
      },
      {
        label: '三级类目',
        // visible: false,
        name: 'remark',
        maxLength: 20,
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default TradeCategorySet;
