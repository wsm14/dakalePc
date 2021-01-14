const TradeCategorySet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 提交表单
  const fetchDataEdit = (payload) => {
    const editType = !initialValues.categoryId;
    dispatch({
      type: { true: 'sysTradeList/fetchTradeAdd', false: 'sysTradeList/fetchTradeSet' }[editType],
      payload: { ...initialValues, ...payload },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `${!initialValues.categoryId ? '新增类目' : '编辑类目'}`,
    loadingModels: 'sysTradeList',
    initialValues,
    formItems: [
      {
        label: '父级类目',
        name: 'parentName',
        visible: initialValues.type === 'second',
        disabled: true,
      },
      {
        label: '一级类目名称',
        name: 'categoryName',
        visible: initialValues.type === 'first',
        maxLength: 10,
      },
      {
        label: '二级类目名称',
        visible: initialValues.type === 'second',
        name: 'categoryName',
        maxLength: 10,
      },
      {
        label: '类目名称',
        visible: !!initialValues.categoryId,
        name: 'categoryName',
        maxLength: 10,
      },
      // {
      //   label: '三级类目名称',
      //   visible: initialValues.type === 'third',
      //   name: 'categoryName',
      //   maxLength: 20,
      // },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default TradeCategorySet;
