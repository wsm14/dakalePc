export default (props) => {
  const { dispatch, childRef, initialValues = {} } = props;

  // 下架
  const fetchStatusClose = (payload) => {
    dispatch({
      type: 'shareManage/fetchStatusClose',
      payload: {
        merchantId: initialValues.merchantIdString,
        momentId: initialValues.userMomentIdString,
        ...payload,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Modal',
    showType: 'form',
    title: `下架原因 - ${initialValues.title}`,
    width: 520,
    loadingModels: 'shareManage',
    onFinish: fetchStatusClose,
    formItems: [
      {
        label: '下架原因',
        name: 'removalReason',
        type: 'textArea',
      },
    ],
  };
};
