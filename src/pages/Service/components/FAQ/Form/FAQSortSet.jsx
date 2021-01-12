const FAQSortSet = (props) => {
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
        label: 'FAQ分类名称',
        name: 'parentName',
        maxLength: 10,
      },
      {
        label: '分类图',
        type: 'upload',
        name: 'goodsDescImg',
        maxFile: 1,
        isCut: true,
        imgRatio: 108 / 108,
        rules: [{ required: false }],
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default FAQSortSet;
