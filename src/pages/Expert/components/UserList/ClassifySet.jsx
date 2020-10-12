const ClassifySet = (props) => {
  const { dispatch, childRef, initialValues = {} } = props;
  // 提交表单
  const fetchDataEdit = (payload) => {
    const editType = !initialValues.domainId;
    dispatch({
      type: { true: 'expertSet/fetchExpertAdd', false: 'expertSet/fetchClassifyEdit' }[editType],
      payload: { ...initialValues, ...payload },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `${!initialValues.domainId ? '新增' : '修改'}`,
    loadingModels: 'expertSet',
    initialValues,
    formItems: [
      {
        label: '领域名称',
        visible: initialValues.parentDomainId == 0,
        name: 'domainName',
      },
      {
        label: '领域',
        visible: initialValues.parentDomainId !== 0 && !!initialValues.parentDomainId,
        name: 'domainNameShow',
        disabled: true,
      },
      {
        label: '内容分类',
        visible: initialValues.parentDomainId !== 0,
        name: 'domainName',
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default ClassifySet;
