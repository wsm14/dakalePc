const LimitPopSet = (props) => {
  const { dispatch, childRef } = props;

  // 新增
  const fetchLimitPopAdd = (values) => {
    dispatch({
      type: 'serviceLimitPop/fetchLimitPopAdd',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '新增人员',
    loadingModels: 'serviceLimitPop',
    formItems: [
      {
        label: '姓名',
        name: 'name',
      },
      {
        label: '手机号',
        name: 'mobile',
      },
    ],
    onFinish: fetchLimitPopAdd,
    ...props,
  };
};

export default LimitPopSet;
