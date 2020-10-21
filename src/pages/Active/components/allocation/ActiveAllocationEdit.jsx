export default (props) => {
  const { dispatch, cRef, initialValues = {} } = props;

  // 审核驳回
  const fetchMerSaleAudit = (payload) => {
    dispatch({
      type: 'activeAllocation/fetchMerSaleAudit',
      payload: {
        merchantVerifyId: initialValues.merchantVerifyIdString,
        verifyStatus: 2,
        ...payload,
      },
      callback: () => {
        cRef.current.fetchGetData();
      },
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '活动位置配置',
    loadingModels: 'activeAllocation',
    initialValues,
    onFinish: fetchMerSaleAudit,
    formItems: [
      {
        label: '活动位置',
        name: 'name',
      },
      {
        label: '活动位置类型',
        name: 'type',
        extra: '和app端约定参数',
      },
    ],
  };
};
